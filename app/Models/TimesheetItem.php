<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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

    // ....
}
