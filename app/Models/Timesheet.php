<?php

namespace App\Models;

use Database\Factories\TimesheetFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property Assignment $assignment
 * @property int        $status
 * @property int        $id
 * @property int        $start
 * @property int      $end
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
    use HasFactory, BelongsToAssignment, HasManyTimesheetItems;

    protected $guarded = [
        'id', 'created_at', 'updated_at', 'deleted_at'
    ];

    public function casts()
    {
        return [
            'date' => 'date',
            'start' => 'date',
            'end' => 'date',
            'sign_off_at' => 'datetime',
        ];
    }

    public function scopeDraft(Builder $query): Builder
    {
        return $query->where(
            'status', Timesheet::DRAFT
        );
    }
}
