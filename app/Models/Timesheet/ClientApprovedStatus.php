<?php

namespace App\Models\Timesheet;

use App\Models\Timesheet;

class ClientApprovedStatus extends TimesheetStatus
{

    public function next(): ?TimesheetStatus
    {
        return new InvoicedStatus($this->context);
    }

    public function prev(): ?TimesheetStatus
    {
        return null;
    }

    public function transition(Timesheet $timesheet): void
    {
        $timesheet->status = TimesheetStatuses::CLIENT_APPROVED;
        $timesheet->save();
    }
}
