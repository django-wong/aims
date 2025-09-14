<?php

namespace App\Jobs;

use App\Models\ClientTimesheetReminder;
use App\Notifications\TimesheetIsWaitingForClientApproval;
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
            $reminder->client->user->notify(
                new ClientReminderForPendingApprovalTimesheet($reminder->timesheet)
            );
            $reminder->timesheet->client_reminder_sent_at = now();
            $reminder->timesheet->save();
        }
    }
}
