<?php

namespace App\Policies;

use App\Models\Timesheet;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Auth\Access\Response;

class TimesheetPolicy
{
    public function viewAny(User $user):bool
    {
        return in_array($user->user_role->role, [
            \App\Models\UserRole::PM,
            \App\Models\UserRole::ADMIN,
            \App\Models\UserRole::FINANCE,
            \App\Models\UserRole::STAFF,
            \App\Models\UserRole::CLIENT
        ]);
    }

    public function view(User $user, Timesheet $model): bool
    {
        $org = $model->assignment->org_id;
        $operation_org = $model->assignment->operation_org_id;

        if ($user->user_role->org_id === $org || $user->user_role->org_id === $operation_org) {
            if ($user->isAnyRole([UserRole::ADMIN, UserRole::PM, UserRole::STAFF])) {
                return true;
            }
            return $model->assignment?->inspector()->is($user) || $model->assignment->project->client->user()->is($user);
        }

        return false;
    }

    public function update(User $user, Timesheet $timesheet): bool|Response
    {
        if ($user->can('inspect', $timesheet->assignment)) {
            if ($timesheet->status === \App\Models\Timesheet::DRAFT) {
                return true;
            } else {
                return Response::deny(
                    'Timesheet is submitted and cannot be modified.'
                );
            }
        }

        return $user->can('update', $timesheet->assignment);
    }

    public function approve(User $user, Timesheet $timesheet)
    {
        if ($user->can('inspect', $timesheet->assignment)) {
            if ($timesheet->status === \App\Models\Timesheet::DRAFT) {
                return true;
            } else {
                return Response::deny(
                    'Timesheet is submitted and cannot be modified.'
                );
            }
        }

        return $user->can('update', $timesheet->assignment) || $timesheet->assignment->project->client->user()->is($user);
    }
}
