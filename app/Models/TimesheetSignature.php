<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimesheetSignature extends Model
{
    use BelongsToTimesheet;

    protected $guarded = [
        'id'
    ];
}
