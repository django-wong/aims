<?php

namespace App\Models\Timesheet;

use App\Models\Timesheet;

/**
 * Initial status of a timesheet, when it's created by a user but not yet submitted for review.
 */
class Draft implements Status
{
    public function prev(Timesheet $timesheet): ?string
    {
        // No previous status for draft, as it's the initial state
        return null;
    }

    /**
     * Depends on the assignment type, if it's delegated to an office, then the
     * office will review this timesheet first. If it's not delegated, then it
     * will be approved automatically and sent to contract holder office approval.
     */
    public function next(Timesheet $timesheet): ?string
    {
        return Reviewing::class;
    }

    public function transition(Timesheet $timesheet): void
    {
        $timesheet->status = Timesheet::DRAFT;
        $timesheet->save();
    }
}
