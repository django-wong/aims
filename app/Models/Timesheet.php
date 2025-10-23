<?php

namespace App\Models;

use App\Notifications\TimesheetRejected;
use Carbon\Traits\Timestamp;
use Database\Factories\TimesheetFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Carbon;

/**
 * @property Assignment                                                  $assignment
 * @property int                                                         $status
 * @property int                                                         $id
 * @property int                                                         $start
 * @property int                                                         $end
 * @property Carbon|\Illuminate\Support\HigherOrderCollectionProxy|mixed $signed_off_at
 * @property \Illuminate\Support\Carbon|mixed                            $client_approved_at
 * @property int                                                         $user_id
 * @property int                                                         $assignment_id
 * @property \Illuminate\Support\Carbon|mixed                            $approved_at
 * @property boolean                                                     $late
 * @property User                                                        $user
 */
class Timesheet extends Model
{
    const DRAFT = 0;
    const REVIEWING = 1;
    const APPROVED = 2;
    const CLIENT_APPROVED = 3;
    const INVOICED = 4;

    /** @use HasFactory<TimesheetFactory> */
    use HasFactory, BelongsToAssignment, HasManyTimesheetItems, BelongsToUser, HasManyTimesheetReport, DynamicPagination;

    protected $guarded = [
        'id', 'created_at', 'updated_at', 'deleted_at'
    ];

    public function casts(): array
    {
        return [
            'date' => 'date',
            'start' => 'date',
            'end' => 'date',
            'late' => 'boolean',
            'signed_off_at' => 'datetime',
            'submitted_at' => 'datetime',
            'approved_at' => 'datetime',
            'client_approved_at' => 'datetime',
            'invoiced_at' => 'datetime',
            'client_reminder_sent_at' => 'datetime',
            'expenses' => 'decimal:2',
        ];
    }

    public function scopeDraft(Builder $query): Builder
    {
        return $query->where(
            'status', Timesheet::DRAFT
        );
    }

    /**
     * The pending timesheets for a person to take action on.
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->where(function (Builder $query) {
            // As a coordinator, I want to see timesheets that need my approval
            $query->orWhere(function (Builder $query) {
                $query
                    ->whereIn('assignment_id', fn(QueryBuilder $query) => $query->select('id')->from('assignments')->where('coordinator_id', auth()->id()))
                    ->where('status', Timesheet::APPROVED);
            });

            // As an operation coordinator, I want to see timesheets that need my review
            $query->orWhere(function (Builder $query) {
                $query
                    ->whereIn('assignment_id', fn(QueryBuilder $query) => $query->select('id')->from('assignments')->where('operation_coordinator_id', auth()->id()))
                    ->where('status', Timesheet::REVIEWING);
            });

            // As a client, I want to see timesheets that need my approval
            $query->orWhere(function (Builder $query) {
                $query
                    ->whereIn('assignment_id', fn(QueryBuilder $query) => $query->select('assignments.id')->from('assignments')->leftJoin('projects', 'assignments.project_id', '=', 'projects.id')->where('projects.client_id', auth()->user()->client?->id ?? 0))
                    ->where('status', Timesheet::APPROVED);
            });
        });
    }

    public function scopeVisible(Builder $query): Builder
    {
        return $query->whereIn('assignment_id', Assignment::query()->visible()->select('id'));
    }

    public function reject($message): void
    {
        $this->update([
            'previous_status' => $this->status,
            'status' => Timesheet::DRAFT,
            'rejected' => true,
            'rejection_reason' => $message,
            'signed_off_at' => null,
            'approved_at' => null,
            'client_approved_at' => null,
            'client_reminder_sent_at' => null,
        ]);

        $this->fireModelEvent('rejected');
    }

    public function signatures()
    {
        return $this->hasOne(TimesheetSignature::class);
    }

    /**
     * Load additional data for the timesheet.
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeExtend(Builder $query)
    {
        $query
            ->leftJoin('users', 'timesheets.user_id', '=', 'users.id')
            ->leftJoin('assignments', 'timesheets.assignment_id', '=', 'assignments.id')
            ->leftJoin('purchase_orders', 'assignments.purchase_order_id', '=', 'purchase_orders.id')
            ->leftJoin('vendors as sub_vendor', 'sub_vendor.id', '=', 'assignments.sub_vendor_id')
            ->leftJoin('vendors as main_vendor', 'main_vendor.id', '=', 'assignments.vendor_id');

        return $query->select('timesheets.*', 'purchase_orders.travel_unit', 'purchase_orders.currency', 'users.name as inspector_name');
    }

    public function getInvoiceable($to_org_id = null): Client|Org|null
    {
        if (is_null($to_org_id)) {
            $to_org_id = auth()->user()->user_role->org_id;
        }

        if (empty($to_org_id)) {
            throw new \Exception('You must provide an org_id or be logged in to determine the invoiceable entity.');
        }

        if ($this->assignment->org_id === $to_org_id) {
            return $this->assignment->project->client;
        }

        return $this->assignment->operation_org_id === $to_org_id ? $this->assignment->org : null;
    }

    public function scopeInvoice(Builder $query, Invoice $invoice): Builder
    {
        return $query->where(function (Builder $query) use ($invoice) {
            $query->where(
                $invoice->invoiceable_type === Client::class
                    ? 'client_invoice_id'
                    : 'contractor_invoice_id',
                $invoice->id
            );
        });
    }
}
