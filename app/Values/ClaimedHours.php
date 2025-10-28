<?php

namespace App\Values;

use App\Models\Assignment;
use App\Models\Timesheet;

class ClaimedHours extends Value
{
    public function value()
    {
        return Timesheet::query()->whereIn(
            'assignment_id', Assignment::query()->visible()->select('id')
        )->sum('hours');
    }
}
