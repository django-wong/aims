<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Vendor;

class VendorPolicy
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

    public function update(User $user, Vendor $vendor)
    {
        return $user->can('update', $vendor->org);
    }

    public function delete(User $user, Vendor $vendor)
    {
        return $user->can('update', $vendor->org);
    }
}
