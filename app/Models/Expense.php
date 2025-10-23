<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property Timesheet $timesheet
 */
class Expense extends Model implements Attachable
{
    /** @use HasFactory<\Database\Factories\ExpenseFactory> */
    use HasFactory, DynamicPagination, BelongsToTimesheet, BelongsToAssignment, HasManyAttachments;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    public function timesheet_item(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(TimesheetItem::class);
    }
}
