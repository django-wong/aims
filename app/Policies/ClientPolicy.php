<?php

namespace App\Policies;

use App\Models\Client;
use App\Models\User;
use App\Models\UserRole;

class ClientPolicy
{
    public function viewAny(User $user):bool
    {
        return in_array($user->user_role->role, [
            UserRole::PM,
            UserRole::ADMIN,
            UserRole::STAFF,
            UserRole::INSPECTOR,
            UserRole::FINANCE,
        ]);
    }

    public function view(User $user, Client $client): bool
    {
        return $this->viewAny($user) && $client->org_id === $user->org->id;
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
        return $this->viewAny($user) && $client->org_id === $user->org->id;
    }

    public function delete(User $user, Client $client): bool
    {
        return $user->can('update', $client->org);
    }
}
