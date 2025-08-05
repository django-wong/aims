<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserRole;

class UserPolicy
{
    public function viewAny(User $user):bool
    {
        return in_array($user->user_role->role, [
            UserRole::FINANCE,
            UserRole::PM,
            UserRole::STAFF,
            UserRole::ADMIN,
        ]);
    }

    public function impersonate(User $user, User $impersonal):bool
    {
        if ($user->id === $impersonal->id) {
            return false;
        }

        return $impersonal->org->id === $user->org->id && in_array($user->user_role->role, [UserRole::ADMIN]);
    }
}
