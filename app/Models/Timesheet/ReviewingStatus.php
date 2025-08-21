<?php

namespace App\Models\Timesheet;

use App\Models\Timesheet;

class ReviewingStatus extends TimesheetStatus
{

    public function next(): ?TimesheetStatus
    {
        return new ContractHolderApprovedStatus(
            $this->context
        );
    }

    public function prev(): ?TimesheetStatus
    {
        return new DraftStatus(
            $this->context
        );
    }

    public function transition(Timesheet $timesheet): void
    {
        $timesheet->status = TimesheetStatuses::REVIEWING;
        $timesheet->save();
        // Send email to the operation office to review the timesheet

    }
}
