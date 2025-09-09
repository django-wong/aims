<?php

namespace App\Models\Timesheet;

use App\Models\Timesheet;

/**
 * Timesheet is submitted by the inspector and is waiting for operation office approval.
 */
class Reviewing implements Status
{
    public function next(Timesheet $timesheet): ?string
    {
        return Approved::class;
    }

    public function prev(Timesheet $timesheet): ?string
    {
        return Draft::class;
    }

    public function transition(Timesheet $timesheet): void
    {
        if (empty($timesheet->signed_off_at)) {
            $timesheet->signed_off_at = now();
        }
        $timesheet->status = Timesheet::REVIEWING;
        $timesheet->save();
        $timesheet->assignment->operation_coordinator->notify(
            new \App\Notifications\TimesheetSubmitted($timesheet)
        );
    }
}
