<?php

namespace App\Policies;

use App\Models\Client;
use App\Models\User;
use App\Models\UserRole;

class ClientPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->user_role->role, [
            UserRole::PM,
            UserRole::ADMIN,
            UserRole::STAFF,
            UserRole::FINANCE,
            UserRole::INSPECTOR
        ]);
    }

    public function view(User $user, Client $client): bool
    {
        return $client->org_id === $user->org->id && $this->create($user);
    }

    public function create(User $user): bool
    {
        return in_array($user->user_role->role, [
            UserRole::PM,
            UserRole::ADMIN,
            UserRole::STAFF,
            UserRole::FINANCE,
        ]);
    }

    public function update(User $user, Client $client): bool
    {
        return $client->org_id === $user->org->id && $this->create($user);
    }

    public function delete(User $user, Client $client): bool
    {
        return $user->can('update', $client->org);
    }
}
