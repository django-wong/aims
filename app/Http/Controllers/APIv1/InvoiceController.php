<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\CreateInvoicesFromTimesheetsRequest;
use App\Models\Client;
use App\Models\CurrentOrg;
use App\Models\Invoice;
use App\Models\Org;
use App\Models\Timesheet;
use App\Models\TimesheetDetail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Spatie\QueryBuilder\AllowedFilter;

class InvoiceController extends Controller
{
    protected function allowedFilters()
    {
        return [
            AllowedFilter::callback('type', function (Builder $query, $value) {
                match ($value) {
                    'inbound' => $query->whereMorphedTo('invoiceable', auth()->user()->user_role->org),
                    'outbound' => $query->where('invoices.org_id', auth()->user()->user_role->org_id),
                };
            })->default('outbound')
        ];
    }

    protected function allowedIncludes()
    {
        return ['invoiceable', 'purchase_order'];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(CurrentOrg $org)
    {
        Gate::authorize('viewAny', Invoice::class);

        $query = $this->getQueryBuilder();

        $query
            ->select([
                'invoices.*',
                'purchase_orders.title as purchase_order_title',
                'clients.business_name as client_business_name',
                'invoiceable.name as org_name',
                'invoiceable.code as org_code',
                'projects.title as project_title',
                'projects.commission_rate as commission_rate',
                'projects.process_fee_rate as process_fee_rate'
            ])
            ->leftJoin('purchase_orders', 'invoices.purchase_order_id', '=', 'purchase_orders.id')
            ->leftJoin('projects', 'purchase_orders.project_id', '=', 'projects.id')
            ->leftJoin('clients', function (JoinClause $query) {
                $query->on('invoices.invoiceable_id', '=', 'clients.id')->where('invoices.invoiceable_type', '=', Client::class);
            })
            ->leftJoin('orgs as invoiceable', function (JoinClause $query) {
                $query->on('invoices.invoiceable_id', '=', 'invoiceable.id')->where('invoices.invoiceable_type', '=', Org::class);
            });

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
    public function update(Request $request, Invoice $invoice)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        //
    }

    public function from_timesheets(CreateInvoicesFromTimesheetsRequest $request, CurrentOrg $org)
    {
        $to_contract_holder_office = [];
        $to_client = [];

        $batch_id = \Str::uuid()->toString();

        $count = 0;
        $timesheets = Timesheet::query()->with('assignment')->whereIn('id', $request->input('timesheets', []))->cursor();

        DB::transaction(function () use ($timesheets, $org, $batch_id) {
            foreach ($timesheets as $timesheet) {
                Gate::authorize('invoice', $timesheet->assignment);
                $invoiceable = $timesheet->getInvoiceable();

                if (!empty($invoiceable)) {
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
                    ]);

                    $timesheet->update([
                        $invoiceable instanceof Org ? 'contractor_invoice_id' : 'client_invoice_id' => $invoice->id,
                        'status' => Timesheet::INVOICED,
                    ]);
                }

            }
        });

        return [
            'message' => "Created $count invoices",
        ];
    }
}
