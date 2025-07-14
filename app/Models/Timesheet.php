<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Timesheet extends Model
{
    /** @use HasFactory<\Database\Factories\TimesheetFactory> */
    use HasFactory, BelongsToAssignment;

    protected $guarded = [
        'id', 'created_at', 'updated_at', 'deleted_at'
    ];
}
