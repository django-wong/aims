<?php

namespace App\Models;

trait HasManyTimesheetReport
{
    public function timesheet_reports()
    {
        return $this->hasMany(TimesheetReport::class);
    }

    public function inspection_report()
    {
        return $this->hasOne(TimesheetReport::class)->where('report_type', 'inspection-report');
    }
}
