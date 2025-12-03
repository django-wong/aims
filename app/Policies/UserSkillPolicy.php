<?php

namespace App\Policies;

use App\Models\InspectorProfile;
use App\Models\User;
use App\Models\UserRole;
use App\Models\UserSkill;
use Illuminate\Auth\Access\Response;

class UserSkillPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, UserSkill $userSkills): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, User $inspector): bool
    {
        return in_array($user->user_role->role, [
            UserRole::ADMIN,
            UserRole::STAFF,
            UserRole::PM,
        ]) && InspectorProfile::query()->where('user_id', $inspector->id)->exists();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, UserSkill $userSkills): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, UserSkill $userSkills): bool
    {
        return $this->create($user, $userSkills->user);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, UserSkill $userSkills): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, UserSkill $userSkills): bool
    {
        return false;
    }
}
