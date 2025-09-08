<?php

namespace App\Models\Timesheet;

use App\Models\Timesheet;
use App\Notifications\TimesheetHasBeenApprovedByClient;
use Illuminate\Support\Facades\Gate;

class ClientApproved implements Status
{
    public function next(Timesheet $timesheet): ?string
    {
        return null;
    }

    public function prev(Timesheet $timesheet): ?string
    {
        return null;
    }

    public function transition(Timesheet $timesheet): void
    {
        Gate::allowIf(
            auth()->id() === $timesheet->assignment->project->client->user_id, 'Only client can approve the timesheet.'
        );

        $timesheet->client_approved_at = now();
        $timesheet->status = Timesheet::CLIENT_APPROVED;
        $timesheet->save();

        $timesheet->assignment->project->client->coordinator?->notify(
            new TimesheetHasBeenApprovedByClient($timesheet)
        );
    }
}
