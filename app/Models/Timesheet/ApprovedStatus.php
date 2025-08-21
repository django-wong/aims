<?php

namespace App\Models\Timesheet;

use App\Models\Timesheet;

class ApprovedStatus extends TimesheetStatus
{

    public function next(): ?TimesheetStatus
    {
        return new ContractHolderApprovedStatus($this->context);
    }

    public function prev(): ?TimesheetStatus
    {
        return new ReviewingStatus($this->context);
    }

    public function transition(Timesheet $timesheet): void
    {
        $timesheet->status = TimesheetStatuses::APPROVED;
        $timesheet->save();
    }
}
