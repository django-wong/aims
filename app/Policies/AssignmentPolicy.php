<?php

namespace App\Policies;

use App\Models\Assignment;
use App\Models\Org;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Gate;

class AssignmentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user):bool
    {
        return in_array($user->user_role->role, [
            \App\Models\UserRole::PM,
            \App\Models\UserRole::ADMIN,
            \App\Models\UserRole::STAFF,
            \App\Models\UserRole::FINANCE,
            \App\Models\UserRole::INSPECTOR,
        ]);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Assignment $assignment): bool
    {
        return Gate::allows('view', $assignment->project) || $user->id === $assignment->inspector_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Org $org): bool
    {
        return UserRole::query()->where('user_id', $user->id)
            ->where('org_id', $org->id)
            ->whereIn('role', [
                UserRole::ADMIN, UserRole::PM, UserRole::STAFF
            ])
            ->exists();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Assignment $assignment): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Assignment $assignment): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Assignment $assignment): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Assignment $assignment): bool
    {
        return false;
    }
}
