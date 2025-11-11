<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\CreateInvoicesFromTimesheetsRequest;
use App\Http\Requests\APIv1\ApproveInvoiceRequest;
use App\Http\Requests\APIv1\IndexInvoiceRequest;
use App\Http\Requests\APIv1\RejectInvoiceRequest;
use App\Http\Requests\APIv1\UpdateInvoiceRequest;
use App\Models\Client;
use App\Models\CurrentOrg;
use App\Models\Invoice;
use App\Models\InvoiceDetail;
use App\Models\Org;
use App\Models\Timesheet;
use App\Models\TimesheetDetail;
use App\Models\User;
use App\Models\UserRole;
use App\Notifications\InvoiceApproved;
use App\Notifications\InvoiceIssued;
use App\Notifications\InvoiceRejected;
use App\PDFs\BasePDF;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Spatie\QueryBuilder\AllowedFilter;

class InvoiceController extends Controller
{
    public function send(Invoice $invoice)
    {
        $invoice->notifiable?->notify(new InvoiceIssued($invoice));

        $invoice->update([
            'status' => Invoice::SENT,
            'sent_at' => now(),
        ]);

        return [
            'message' => 'Invoice sent successfully',
        ];
    }

    public function approve(ApproveInvoiceRequest $request, Invoice $invoice)
    {
        Gate::authorize('approve', $invoice);

        $invoice->update([
            'status' => Invoice::APPROVED,
            'approved_at' => now(),
            'signature_base64' => $request->validated('signature_base64'),
        ]);

        $invoice->user->notify(new InvoiceApproved($invoice));

        return [
            'message' => 'Invoice approved successfully',
        ];
    }

    public function reject(RejectInvoiceRequest $request, Invoice $invoice)
    {
        Gate::authorize('reject', $invoice);

        $invoice->update([
            'status' => Invoice::REJECTED,
            'rejected_at' => now(),
            'rejection_reason' => $request->validated('rejection_reason'),
        ]);

        $invoice->user?->notify(new InvoiceRejected($invoice));

        return [
            'message' => 'Invoice rejected successfully',
        ];
    }

    public function create_client_invoice(Invoice $invoice, CurrentOrg $org)
    {
        $client = $invoice->purchase_order->project->client;

        $exists = Timesheet::query()->where('contractor_invoice_id', $invoice->id)->whereNotNull('client_invoice_id')->exists();

        if ($exists) {
            abort(400, 'Client invoice already created for one or more timesheets');
        }

        $new = Invoice::query()->create([
            'purchase_order_id' => $invoice->purchase_order_id,
            'invoiceable_type' => Client::class,
            'invoiceable_id' => $client->id,
            'org_id' => $org->id,
            'user_id' => auth()->user()->id,
            'status' => Invoice::DRAFT,
        ]);

        Timesheet::query()->where('contractor_invoice_id', $invoice->id)->update(['client_invoice_id' => $new->id]);

        return [
            'message' => 'Client invoice created successfully',
            'invoice' => $new,
        ];
    }

    protected function allowedFilters()
    {
        return [
            AllowedFilter::callback('type', function (Builder $query, $value) {
                if (auth()->user()->isRole(UserRole::CLIENT)) {
                    $query
                        ->where('status', '!=', Invoice::DRAFT)
                        ->whereMorphedTo(
                            'invoiceable', auth()->user()->client
                        );
                } else {
                    match ($value) {
                        'inbound' => $query
                            ->where('status', '!=', Invoice::DRAFT)
                            ->whereMorphedTo(
                                'invoiceable', auth()->user()->user_role->org
                            ),
                        'outbound' => $query
                            ->where(
                                'invoice_details.org_id', auth()->user()->user_role->org_id
                            ),
                    };
                }
            })->default('outbound'),

            AllowedFilter::callback('keywords', function (Builder $query, $value) {
                $columns = [
                    'purchase_order_title',
                    'invoiceable_org_name',
                    'invoiceable_client_business_name',
                    'project_title',
                ];

                if ($value) {
                    $query->whereAny($columns, 'like', "%$value%");
                }
            }),

            AllowedFilter::exact('selection', 'id'),

            AllowedFilter::callback('view', function (Builder $query, $value) {
                switch ($value) {
                    case 'open':
                        $query->whereRaw('(approved_at is null and status > 0)');
                        break;
                    default:
                        // do nothing
                        break;
                }
            })->default('all')
        ];
    }

    protected function allowedIncludes()
    {
        return ['invoiceable', 'purchase_order'];
    }

    protected function getModel(): string
    {
        return InvoiceDetail::class;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(IndexInvoiceRequest $request, CurrentOrg $org)
    {
        Gate::authorize('viewAny', Invoice::class);

        $query = $this->getQueryBuilder();

        if ($request->has('export')) {
            if ($request->input('export') === 'xero') {
                return \App\Exports\InvoiceXero::fromQueryBuilder($query)->download('xero-invoices.csv');
            }
            return \App\Exports\Invoice::fromQueryBuilder($query)->download('invoices.csv');
        }

        return $query->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInvoiceRequest $request, Invoice $invoice)
    {
        $invoice = $invoice->update($request->validated());

        return [
            'message' => 'Invoice updated successfully',
            'invoice' => $invoice,
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        Gate::authorize('destroy', $invoice);
        $invoice->delete();

        return [
            'message' => 'Invoice deleted successfully',
        ];
    }

    public function from_timesheets(CreateInvoicesFromTimesheetsRequest $request, CurrentOrg $org)
    {
        $batch_id = \Str::uuid()->toString();

        $count = 0;
        $timesheets = Timesheet::query()->with('assignment')->whereIn('id', $request->input('timesheets', []))->cursor();

        DB::transaction(function () use ($timesheets, $org, $batch_id, &$count) {
            foreach ($timesheets as $timesheet) {
                Gate::authorize('invoice', $timesheet->assignment);
                $invoiceable = $timesheet->getInvoiceable();

                if (empty($invoiceable)) {
                    continue;
                }

                if ($invoiceable instanceof Org) {
                    if (!empty($timesheet->contractor_invoice_id)) {
                        continue;
                    }
                }

                if ($invoiceable instanceof Client) {
                    if (!empty($timesheet->client_invoice_id)) {
                        continue;
                    }
                }


                $invoice = Invoice::query()->firstOrCreate([
                    'org_id' => $org->id,
                    'purchase_order_id' => $timesheet->assignment->purchase_order_id,
                    'status' => Invoice::DRAFT,
                    'invoiceable_type' => $invoiceable::class,
                    'invoiceable_id' => $invoiceable->id,
                    'batch_id' => $batch_id,
                ], [
                    'user_id' => auth()->user()->id,
                ]);

                if ($invoice->wasRecentlyCreated) {
                    $count++;
                }

                $timesheet->update([
                    $invoiceable instanceof Org ? 'contractor_invoice_id' : 'client_invoice_id' => $invoice->id,
                ]);

                activity()->on($timesheet)->withProperties($timesheet->getChanges())->log('Added to invoice');
            }
        });

        return [
            'message' => "Created $count invoices",
        ];
    }

    public function pdf(Invoice $invoice)
    {
        $pdf = new \App\PDFs\Invoice($invoice);
        $pdf->render();
        return $pdf->Output("invoice-{$invoice->id}.pdf", 'I');
    }

    public function pdf_breakdown(Invoice $invoice)
    {
        return Pdf::loadView('pdfs.invoice-breakdown', ['invoice' => InvoiceDetail::query()->find($invoice->id)])
            ->setPaper('a4', 'landscape')
            ->stream("invoice-{$invoice->id}.pdf");
    }
}
