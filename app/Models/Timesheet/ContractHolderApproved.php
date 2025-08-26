<?php

namespace App\Models\Timesheet;

use App\Models\Timesheet;

class ContractHolderApproved implements Status
{

    public function next(Timesheet $timesheet): ?string
    {
        return ClientApproved::class;
    }

    public function prev(Timesheet $timesheet): ?string
    {
        return Approved::class;
    }

    public function transition(Timesheet $timesheet): void
    {
        $timesheet->status = Timesheet::CONTRACT_HOLDER_APPROVED;
        $timesheet->save();
    }
}
