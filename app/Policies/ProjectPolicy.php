<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use App\Models\UserRole;

class ProjectPolicy
{
    public function viewAny(User $user):bool
    {
        return in_array($user->user_role->role, [
            \App\Models\UserRole::PM,
            \App\Models\UserRole::ADMIN,
        ]);
    }

    /**
     * Determine whether the user can view the project.
     */
    public function view(User $user, Project $project): bool
    {
        return UserRole::query()->where('user_id', $user->id)->where('org_id', $project->org_id)->exists();
    }
}
