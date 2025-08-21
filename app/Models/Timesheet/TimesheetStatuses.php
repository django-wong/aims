<?php

namespace App\Models\Timesheet;

// Status of the timesheet: 0 = draft, 1 = reviewing, 2 = approved, 3 = contract holder approved, 4 = client approved, 5 = invoiced
use App\Models\Timesheet;

enum TimesheetStatuses: int
{
    case DRAFT = 0;
    case REVIEWING = 1;
    case APPROVED = 2;
    case CONTRACT_HOLDER_APPROVED = 3;
    case CLIENT_APPROVED = 4;
    case INVOICED = 5;

    static public function make(Timesheet $timesheet): TimesheetStatus
    {
        return match(TimesheetStatuses::from($timesheet->status)) {
            self::DRAFT => new DraftStatus($timesheet),
            self::REVIEWING => new ReviewingStatus($timesheet),
            self::APPROVED => new ApprovedStatus($timesheet),
            self::CONTRACT_HOLDER_APPROVED => new ContractHolderApprovedStatus($timesheet),
            self::CLIENT_APPROVED => new ClientApprovedStatus($timesheet),
            self::INVOICED => new InvoicedStatus($timesheet)
        };
    }
}
