<?php

use App\Jobs\CheckLateReport;
use App\Jobs\RemindClientForPendingApprovalTimesheet;
use App\Jobs\RemindForPendingInvoice;
use App\Jobs\UpcomingAssignmentReminder;
use App\Models\Org;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Schema;


if (Schema::hasTable('orgs')) {
    Org::query()->each(function ($org) {
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

/*
 * Email reminder to clients to approve reports after 2 days from submission from BIE office
 */
Schedule::job(new RemindClientForPendingApprovalTimesheet)->hourly();

/**
 * Email reminder to clients on pending invoices after X days from invoice sent date
 * X is configurable per client, default to 7 days
 * For invoices issued to contract holders, the reminder is sent after 7 days.
 */
Schedule::job(new RemindForPendingInvoice())->everyMinute();
