<?php

namespace App\Policies;

use App\Models\Client;
use App\Models\User;

class ClientPolicy
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

    public function view(User $user, Client $client): bool
    {
        return $this->viewAny($user) && $client->org_id === $user->org->id;
    }

    public function create(User $user): bool
    {
        return in_array($user->user_role->role, [
            \App\Models\UserRole::PM,
            \App\Models\UserRole::ADMIN,
            \App\Models\UserRole::STAFF,
            \App\Models\UserRole::FINANCE,
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
