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

        return $impersonal->org->id === $user->org->id && $user->user_role->role == UserRole::ADMIN;
    }

    public function create(User $user): bool
    {
        return $user->user_role->role == UserRole::ADMIN;
    }

    public function update(User $user, User $model): bool
    {
        // Admin can update any user in their organization
        if ($user->user_role->role == UserRole::ADMIN) {
            return $model->user_role->org_id === $user->user_role->org_id;
        }

        // Users can only update themselves
        return $user->id === $model->id;
    }
}
