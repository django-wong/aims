<?php

namespace App\Models;

use App\Models\Timesheet\TimesheetStatuses;
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
    /** @use HasFactory<TimesheetFactory> */
    use HasFactory, BelongsToAssignment, HasManyTimesheetItems;

    protected $guarded = [
        'id', 'created_at', 'updated_at', 'deleted_at'
    ];

    public function scopeDraft(Builder $query): Builder
    {
        return $query->where(
            'status', TimesheetStatuses::DRAFT
        );
    }
}
