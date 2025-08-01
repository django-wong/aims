<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user):bool
    {
        return in_array($user->user_role->role, [
            \App\Models\UserRole::PM,
            \App\Models\UserRole::ADMIN,
            \App\Models\UserRole::STAFF,
            \App\Models\UserRole::FINANCE,
        ]);
    }

    public function impersonate(User $user, User $impersonal):bool
    {
        return $impersonal->org->id === $user->org->id
            && in_array($user->user_role->role, [
                \App\Models\UserRole::ADMIN,
            ]);
    }
}
