<?php

use App\Jobs\RemindClientForPendingApprovalTimesheet;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(
        Inspiring::quote()
    );
})->purpose('Display an inspiring quote');


Schedule::job(new RemindClientForPendingApprovalTimesheet)->hourly();

if (\Illuminate\Support\Facades\Schema::hasTable('orgs')) {
    \App\Models\Org::query()->each(function ($org) {
        Schedule::call(function () {
            // Check for any missing timesheets for open assignments from the previous week.

        })->weeklyOn(1, '10:00')->timezone($org->timezone);
    });
}
