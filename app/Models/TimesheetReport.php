<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimesheetReport extends Model implements Attachable
{
    /** @use HasFactory<\Database\Factories\TimesheetReportFactory> */
    use HasFactory, HasManyAttachments, DynamicPagination, BelongsToTimesheet;

    protected $guarded = [
        'id'
    ];
}
