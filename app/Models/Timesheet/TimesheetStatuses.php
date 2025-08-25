<?php

namespace App\Models\Timesheet;

use App\Models\Timesheet;

class TimesheetStatuses
{
    const DRAFT = 0;
    const REVIEWING = 1;
    const APPROVED = 2;
    const CONTRACT_HOLDER_APPROVED = 3;
    const CLIENT_APPROVED = 4;
    const INVOICED = 5;

    static public function make(Timesheet $timesheet): TimesheetStatus
    {
        return match($timesheet->status) {
            self::DRAFT => new DraftStatus($timesheet),
            self::REVIEWING => new ReviewingStatus($timesheet),
            self::APPROVED => new ApprovedStatus($timesheet),
            self::CONTRACT_HOLDER_APPROVED => new ContractHolderApprovedStatus($timesheet),
            self::CLIENT_APPROVED => new ClientApprovedStatus($timesheet),
            self::INVOICED => new InvoicedStatus($timesheet)
        };
    }
}
