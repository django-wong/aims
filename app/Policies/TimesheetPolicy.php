<?php

namespace App\Policies;

use App\Models\Timesheet;
use App\Models\User;
use App\Models\UserRole;

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
}
