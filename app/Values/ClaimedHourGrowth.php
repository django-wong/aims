<?php

namespace App\Values;

use App\Models\Timesheet;
use Carbon\Carbon;

class ClaimedHourGrowth extends Value
{
    public function value(): int
    {
        $now = Carbon::now();
        $this_week = $now->format('Y-\WW');
        $last_week = $now->subWeek()->format('Y-\WW');

        $a = Timesheet::query()->where('timesheets.week', $this_week)->sum('timesheets.hours');
        $b = Timesheet::query()->where('timesheets.week', $last_week)->sum('timesheets.hours');

        if ($b == 0) {
            return 0;
        }
        return ($a - $b);
    }
}
