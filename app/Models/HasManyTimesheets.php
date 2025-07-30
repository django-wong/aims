<?php

namespace App\Models;

trait HasManyTimesheets
{
    public function timesheets()
    {
        return $this->hasMany(Timesheet::class);
    }
}
