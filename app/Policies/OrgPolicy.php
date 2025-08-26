<?php

namespace App\Policies;

use App\Models\Org;
use App\Models\User;
use App\Models\UserRole;

class OrgPolicy {
    public function create(User $user): bool
    {
        return $user->email === config('app.system_admin') || $user->id === 1;
    }

    public function update(User $user, Org $org): bool
    {
        return $user->isRole(UserRole::ADMIN) && $user->user_role->org_id === $org->id;
    }
}
