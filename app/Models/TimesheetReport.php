<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int|mixed                        $closed_or_rev_by_id
 * @property \Illuminate\Support\Carbon|mixed $rev_date
 * @property int|mixed                        $rev
 */
class TimesheetReport extends Model implements Attachable
{
    /** @use HasFactory<\Database\Factories\TimesheetReportFactory> */
    use HasFactory, HasManyAttachments, DynamicPagination, BelongsToTimesheet;

    protected $guarded = [
        'id'
    ];

    protected function casts(): array
    {
        return [
            'closed_date' => 'date',
            'rev_date' => 'date',
            'visit_date' => 'date',
            'is_closed' => 'boolean',
        ];
    }

    protected static function booted()
    {
        static::saving(function (TimesheetReport $report) {
            if ($report->is_closed && empty($report->closed_date)) {
                $report->closed_date = now();
                $report->closed_or_rev_by_id = auth()->id();
            }
        });
    }

    public function closed_or_rev_by()
    {
        return $this->belongsTo(User::class, 'closed_or_rev_by_id');
    }
}
