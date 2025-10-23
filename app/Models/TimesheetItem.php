<?php

namespace App\Models;

use App\Jobs\MonitorPurchaseOrderUsage;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Database\Query\JoinClause;
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

    public function scopeExtend(Builder $query)
    {
        return $query->leftJoin('timesheet_item_expense_by_types', 'timesheet_items.id', '=', 'timesheet_item_expense_by_types.timesheet_item_id')
            ->addSelect([
                DB::raw('timesheet_item_expense_by_types.expenses_by_type as expenses_by_type'),
            ])
            ->withCasts([
                'expenses_by_type' => 'array',
            ]);
    }
}
