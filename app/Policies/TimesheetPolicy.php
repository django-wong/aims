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
        ]);
    }

    public function view(User $user, Timesheet $model): bool
    {
        return $user->isAnyRole([UserRole::ADMIN, UserRole::PM, UserRole::STAFF]) ||
            ($user->isRole(UserRole::INSPECTOR) && $model->assignment?->inspector_id === $user->id);
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
}
