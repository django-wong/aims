<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Support\Facades\Gate;

class ProjectPolicy
{
    public function viewAny(User $user):bool
    {
        return in_array($user->user_role->role, [
            UserRole::PM,
            UserRole::STAFF,
            UserRole::ADMIN,
            UserRole::CLIENT,
            UserRole::INSPECTOR,
        ]);
    }

    public function create(User $user): bool
    {
        return $user->isAnyRole([
            UserRole::FINANCE,
            UserRole::PM,
            UserRole::STAFF,
            UserRole::ADMIN,
        ]);
    }

    public function view(User $user, Project $project): bool
    {
        if ($user->user_role->org_id === $project->org_id) {
            if ($this->create($user)) {
                return true;
            }

            $client = $user->client;
            if ($client && $client->id === $project->client_id) {
                return true;
            }
        }

        return false;
    }

    public function update(User $user, Project $project): bool
    {
        return $user->can('update', $project->client) || $user->can('update', $project->org);
    }
}
