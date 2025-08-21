<?php

namespace App\Models\Timesheet;

use App\Models\Timesheet;

class InvoicedStatus extends TimesheetStatus
{

    public function next(): ?TimesheetStatus
    {
        return null;
    }

    public function prev(): ?TimesheetStatus
    {
        return null;
    }

    public function transition(Timesheet $timesheet): void
    {
        $timesheet->status = TimesheetStatuses::INVOICED;
        $timesheet->save();
    }
}
