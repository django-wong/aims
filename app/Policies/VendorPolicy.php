<?php

namespace App\Policies;

use App\Models\User;

class VendorPolicy
{
    public function viewAny(User $user):bool
    {
        dd($user);
        return in_array($user->user_role->role, [
            \App\Models\UserRole::PM,
            \App\Models\UserRole::ADMIN,
            \App\Models\UserRole::STAFF,
            \App\Models\UserRole::FINANCE,
        ]);
    }
}
