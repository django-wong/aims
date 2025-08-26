<?php

namespace App\Models\Timesheet;

use App\Models\Timesheet;

interface Status
{
    public function next(Timesheet $timesheet): ?string;
    public function prev(Timesheet $timesheet): ?string;
    public function transition(Timesheet $timesheet): void;
}
