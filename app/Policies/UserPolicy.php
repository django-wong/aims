<?php

namespace App\Policies;

use App\Models\Client;
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

        if ($user->id == 1) {
            return true;
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

    public function viewDashboard(User $user): bool
    {
        if (Client::query()->where('user_id', $user->id)->exists()) {
            return true; // Client is not part of the org, but they allowed to view their own dashboard
        }
        // Inspector is part of the org, but they can only view their own assignment
        return in_array($user->user_role?->role, [
            UserRole::FINANCE,
            UserRole::PM,
            UserRole::STAFF,
            UserRole::ADMIN,
        ]);
    }

    public function delete(User $user, User $model): bool
    {
        if ($user->user_role->role == UserRole::ADMIN) {
            return $model->user_role->org_id === $user->user_role->org_id;
        }
        return false;
    }

    public function view(User $user, User $model): bool
    {
        if ($user->is($model)) {
            return true;
        }

        return $user->user_role->org_id === $model->user_role->org_id && $user->isAnyRole([
            UserRole::ADMIN,
            UserRole::PM,
            UserRole::STAFF
        ]);
    }
}
