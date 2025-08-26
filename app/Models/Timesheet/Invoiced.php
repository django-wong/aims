<?php

namespace App\Models\Timesheet;

use App\Models\Timesheet;

class Invoiced implements Status
{
    public function transition(Timesheet $timesheet): void
    {
        $timesheet->status = Timesheet::INVOICED;
        $timesheet->save();
    }

    public function next(Timesheet $timesheet): ?string
    {
        return null;
    }

    public function prev(Timesheet $timesheet): ?string
    {
        return null;
    }
}
