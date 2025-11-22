<?php

namespace App\Jobs;

use App\Models\ClientTimesheetReminder;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Notifications\ClientReminderForPendingApprovalTimesheet;

/**
 * Email reminder to clients to approve reports after 2 days from submission from BIE office
 */
class RemindClientForPendingApprovalTimesheet implements ShouldQueue
{
    use Queueable;

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        while ($reminder = ClientTimesheetReminder::query()->first()) {
            sleep(1);
            $reminder->client->notify(
                new ClientReminderForPendingApprovalTimesheet($reminder->timesheet)
            );
            $reminder->timesheet->client_reminder_sent_at = now();
            $reminder->timesheet->save();

            activity()
                ->on($reminder->timesheet)
                ->withProperties($reminder->timesheet->getChanges())
                ->log(
                    'Client reminded for pending approval timesheet'
                );
        }
    }
}
