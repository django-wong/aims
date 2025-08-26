<?php

namespace App\Models\Timesheet;

use App\Models\Timesheet;

class ClientApproved implements Status
{
    public function next(Timesheet $timesheet): ?string
    {
        return Invoiced::class;
    }

    public function prev(Timesheet $timesheet): ?string
    {
        return null;
    }

    public function transition(Timesheet $timesheet): void
    {
        $timesheet->status = Timesheet::CLIENT_APPROVED;
        $timesheet->save();
    }
}
