<?php

namespace App\Models\Timesheet;

use App\Models\Timesheet;
use App\Notifications\TimesheetIsWaitingForClientApproval;
use Illuminate\Support\Facades\DB;

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

        DB::transaction(function () use ($timesheet) {
            $timesheet->approved_at = now();
            $timesheet->status = Timesheet::APPROVED;
            $timesheet->rejected = false;
            $timesheet->rejection_reason = '';
            $timesheet->save();

            $timesheet->signatures()->updateOrCreate([
                'timesheet_id' => $timesheet->id,
            ], [
                'coordinator_signature' => request('signature_base64'),
            ]);
        });

        $client = $timesheet->assignment?->project?->client;
        $client?->notify(
            new TimesheetIsWaitingForClientApproval($timesheet)
        );

        activity()->byAnonymous()
            ->on($timesheet)
            ->withProperties($timesheet->getChanges())
            ->log(
                'Notified client for timesheet approval',
            );
    }
}
