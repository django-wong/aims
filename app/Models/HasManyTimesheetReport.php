<?php

namespace App\Models;

trait HasManyTimesheetReport
{
    public function timesheet_reports()
    {
        return $this->hasMany(TimesheetReport::class);
    }
}
