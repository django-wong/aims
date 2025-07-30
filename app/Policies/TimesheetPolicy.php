<?php

namespace App\Policies;

use App\Models\User;

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
}
