<?php

namespace App\Models\Timesheet;

use App\Models\Timesheet;
use App\Models\User;
use App\Notifications\TimesheetIsWaitingForClientApproval;
use App\Notifications\TimesheetIsWaitingForContractorOfficeApproval;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

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
        Gate::allowIf(
            auth()->user()->user_role->org_id === $timesheet->assignment->org_id, 'Only contract holder can approve the timesheet'
        );

        $timesheet->contract_holder_approved_at = now();

        $timesheet->status = Timesheet::CONTRACT_HOLDER_APPROVED;
        $timesheet->save();

        $timesheet->assignment->project->client->user->notify(
            new TimesheetIsWaitingForClientApproval($timesheet)
        );
    }
}
