<?php

namespace App\Models\Timesheet;

use App\Models\Timesheet;
use App\Notifications\TimesheetIsWaitingForContractorOfficeApproval;

/**
 * Operation office has approved the timesheet, now it's waiting for contract holder office approval.
 */
class Approved implements Status
{

    public function next(Timesheet $timesheet): ?string
    {
        return ContractHolderApproved::class;
    }

    public function prev(Timesheet $timesheet): ?string
    {
        $operation_org_id = $timesheet->assignment->operation_org_id;
        if (! empty($operation_org_id) && $operation_org_id !== $timesheet->assignment->org_id) {
            return Draft::class;
        }
        return Reviewing::class;
    }

    public function transition(Timesheet $timesheet): void
    {
        if (empty($timesheet->signed_off_at)) {
            $timesheet->signed_off_at = now();
        }

        $timesheet->approved_at = now();

        $timesheet->status = Timesheet::APPROVED;
        $timesheet->save();

        $timesheet->assignment->project->client->coordinator?->notify(
            new TimesheetIsWaitingForContractorOfficeApproval($timesheet)
        );
    }
}
