<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property mixed $assignment
 */
class Timesheet extends Model
{
    /** @use HasFactory<\Database\Factories\TimesheetFactory> */
    use HasFactory, BelongsToAssignment, HasManyTimesheetItems;

    const STATUS_DRAFT = 0;
    const STATUS_REVIEWING = 1;
    const STATUS_APPROVED = 2;
    const STATUS_CONTRACT_HOLDER_APPROVED = 3;
    const STATUS_CLIENT_APPROVED = 4;
    const STATUS_INVOICED = 5;

    protected $guarded = [
        'id', 'created_at', 'updated_at', 'deleted_at'
    ];

    public function scopeDraft(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_DRAFT);
    }
}
