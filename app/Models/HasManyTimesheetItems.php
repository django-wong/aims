<?php

namespace App\Models;

trait HasManyTimesheetItems
{
    public function timesheet_items()
    {
        return $this->hasMany(TimesheetItem::class);
    }
}
