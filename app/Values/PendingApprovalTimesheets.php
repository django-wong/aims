<?php

namespace App\Values;

use App\Models\Assignment;
use App\Models\Timesheet;

class PendingApprovalTimesheets extends Value
{
    public function value(): int
    {
        return Timesheet::query()->whereIn(
            'assignment_id', Assignment::query()->scoped()->select('id')
        )->count();
    }
}
