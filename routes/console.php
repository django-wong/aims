<?php

use App\Jobs\CheckLateReport;
use App\Jobs\RemindClientForPendingApprovalTimesheet;
use App\Jobs\UpcomingAssignmentReminder;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(
        Inspiring::quote()
    );
})->purpose('Display an inspiring quote');



/*
 * Email reminder to clients to approve reports after 2 days from submission from BIE office
 */
Schedule::job(new RemindClientForPendingApprovalTimesheet)->hourly();

if (\Illuminate\Support\Facades\Schema::hasTable('orgs')) {
    \App\Models\Org::query()->each(function ($org) {
        /**
         * Weekly Notification Report issue to coordinators on missing reports not submitted by inspectors by 10 am on
         * Mondays (Deadline)
         */
        Schedule::job(new CheckLateReport($org))->weeklyOn(1, '10:00')->timezone($org->timezone);

        /**
         * Inspection assignments issued by coordinators exceeding 7 days require a notification to inspectors and
         * coordinator 1 day prior to the inspection date to remind of the inspection assignment (maybe have the
         * inspection assignment re-set in email to remind of inspection)
         */
        Schedule::job(new UpcomingAssignmentReminder($org))->dailyAt(10)->timezone($org->timezone);
    });
}
