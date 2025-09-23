<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserRole;

class InvoicePolicy
{
    public function viewAny(User $user):bool
    {
        return in_array($user->user_role->role, [
            UserRole::PM,
            UserRole::ADMIN,
            UserRole::FINANCE,
        ]);
    }

    public function create(User $user):bool
    {
        return in_array($user->user_role->role, [
            UserRole::PM,
            UserRole::ADMIN,
            UserRole::FINANCE,
            UserRole::STAFF,
            UserRole::SYSTEM
        ]);
    }

    public function view(User $user):bool
    {
        return true;
    }
}
