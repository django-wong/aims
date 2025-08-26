<?php

namespace App\Models\Timesheet;

use App\Models\Timesheet;

class Reviewing implements Status
{
    public function next(Timesheet $timesheet): ?string
    {
        return ContractHolderApproved::class;
    }

    public function prev(Timesheet $timesheet): ?string
    {
        return Draft::class;
    }

    public function transition(Timesheet $timesheet): void
    {
        $timesheet->status = Timesheet::REVIEWING;
        $timesheet->save();
    }
}
