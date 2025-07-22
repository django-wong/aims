<?php

namespace App\Policies;

use App\Models\User;

class OrgPolicy {
    public function create(User $user): bool
    {
        return $user->email === config('app.system_admin') || $user->id === 1;
    }
}
