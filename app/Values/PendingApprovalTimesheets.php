<?php

namespace App\Values;

use App\Models\Assignment;
use App\Models\Timesheet;
use App\Models\UserRole;
use Illuminate\Database\Eloquent\Builder;

class PendingApprovalTimesheets extends Value
{
    public function value(): int
    {
        return Timesheet::query()
            ->whereIn('assignment_id', Assignment::query()->scoped()->select('id'))
            ->tap(function (Builder $query) {
                $query->where(
                    'timesheets.status',
                    auth()->user()->isRole(UserRole::CLIENT) ? Timesheet::APPROVED : Timesheet::REVIEWING
                );
            })
            ->count();
    }
}
