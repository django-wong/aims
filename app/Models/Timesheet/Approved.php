<?php

namespace App\Models\Timesheet;

use App\Models\Timesheet;
use App\Notifications\TimesheetIsWaitingForContractorOfficeApproval;

class Approved implements Status
{

    public function next(Timesheet $timesheet): ?string
    {
        return ContractHolderApproved::class;
    }

    public function prev(Timesheet $timesheet): ?string
    {
        return Reviewing::class;
    }

    public function transition(Timesheet $timesheet): void
    {
        $timesheet->status = Timesheet::APPROVED;
        $timesheet->save();
        $timesheet->assignment->project->client->coordinator?->notify(
            new TimesheetIsWaitingForContractorOfficeApproval($timesheet)
        );
    }
}
