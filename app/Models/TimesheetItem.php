<?php

namespace App\Models;

use App\Jobs\MonitorPurchaseOrderUsage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

/**
 * @property Timesheet $timesheet
 */
class TimesheetItem extends Model implements Attachable
{
    /** @use HasFactory<\Database\Factories\TimesheetItemFactory> */
    use HasFactory, BelongsToTimesheet, BelongsToUser, HasManyAttachments;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    protected static function booted()
    {
        static::saved(function (TimesheetItem $item) {
            MonitorPurchaseOrderUsage::dispatch($item->timesheet->assignment->purchase_order);
        });
    }
}
