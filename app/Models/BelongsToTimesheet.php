<?php

namespace App\Models;

trait BelongsToTimesheet
{
    public function timesheet()
    {
        return $this->belongsTo(Timesheet::class);
    }
}
