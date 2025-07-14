<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class TimesheetItem extends Model
{
    /** @use HasFactory<\Database\Factories\TimesheetItemFactory> */
    use HasFactory, BelongsToTimesheet;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}
