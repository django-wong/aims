<?php

namespace App\Models\Timesheet;

use App\Models\Timesheet;
use App\Notifications\TimesheetIsWaitingForClientApproval;

/**
 * Operation office has approved the timesheet, now it's waiting for contract holder office approval.
 */
class Approved implements Status
{

    public function next(Timesheet $timesheet): ?string
    {
        return ClientApproved::class;
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

        $client = $timesheet->assignment?->project?->client;
        foreach ([$client?->coordinator, $client?->reviewer] as $notifiable) {
            $notifiable?->notify(
                new TimesheetIsWaitingForClientApproval($timesheet)
            );
        }
    }
}
