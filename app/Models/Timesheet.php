<?php

namespace App\Models;

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
 * @property \Illuminate\Support\Carbon|mixed                            $contract_holder_approved_at
 * @property \Illuminate\Support\Carbon|mixed                            $client_approved_at
 * @property int                                                         $user_id
 * @property int                                                       $assignment_id
 */
class Timesheet extends Model
{
    const DRAFT = 0;
    const REVIEWING = 1;
    const APPROVED = 2;
    const CONTRACT_HOLDER_APPROVED = 3;
    const CLIENT_APPROVED = 4;
    const INVOICED = 5;

    /** @use HasFactory<TimesheetFactory> */
    use HasFactory, BelongsToAssignment, HasManyTimesheetItems, BelongsToUser;

    protected $guarded = [
        'id', 'created_at', 'updated_at', 'deleted_at'
    ];

    public function casts()
    {
        return [
            'date' => 'date',
            'start' => 'date',
            'end' => 'date',
            'signed_off_at' => 'datetime',
            'approved_at' => 'datetime',
            'contract_holder_approved_at' => 'datetime',
            'client_approved_at' => 'datetime',
            'invoiced_at' => 'datetime',
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
    public function scopePending(Builder $query)
    {
        return $query->where(function (Builder $query) {
            // As a coordinator, I want to see timesheets that need my approval
            $query->orWhere(function (Builder $query) {
                $query
                    ->whereIn('assignment_id', fn (QueryBuilder $query) => $query->select('id')->from('assignments')->where('coordinator_id', auth()->id()))
                    ->where('status', Timesheet::APPROVED);
            });

            // As an operation coordinator, I want to see timesheets that need my review
            $query->orWhere(function (Builder $query) {
                $query
                    ->whereIn('assignment_id', fn (QueryBuilder $query) => $query->select('id')->from('assignments')->where('operation_coordinator_id', auth()->id()))
                    ->where('status', Timesheet::REVIEWING);
            });

            // As a client, I want to see timesheets that need my approval
            $query->orWhere(function (Builder $query) {
                $query
                    ->whereIn('assignment_id', fn (QueryBuilder $query) => $query->select('assignments.id')->from('assignments')->leftJoin('projects', 'assignments.project_id', '=', 'projects.id')->where('projects.client_id', auth()->user()->client?->id ?? 0))
                    ->where('status', Timesheet::CONTRACT_HOLDER_APPROVED);
            });
        });
    }

    public function scopeVisible(Builder $query): Builder
    {
        return $query->whereIn('assignment_id', Assignment::query()->visible()->select('id'));
    }
}
