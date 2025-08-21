<?php

namespace App\Models\Timesheet;

use App\Models\Timesheet;

class ContractHolderApprovedStatus extends TimesheetStatus
{

    public function next(): ?TimesheetStatus
    {
        return new ClientApprovedStatus($this->context);
    }

    public function prev(): ?TimesheetStatus
    {
        return new ApprovedStatus($this->context);
    }

    public function transition(Timesheet $timesheet): void
    {
        $timesheet->status = TimesheetStatuses::CONTRACT_HOLDER_APPROVED;
        $timesheet->save();
    }
}
