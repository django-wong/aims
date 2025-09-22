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
            UserRole::PM, UserRole::ADMIN, UserRole::STAFF, UserRole::CLIENT, UserRole::FINANCE, UserRole::INSPECTOR
        ]);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Assignment $assignment): bool
    {
        if ($user->can('inspect', $assignment)) {
            return true;
        };

        if ($user->user_role->org_id === $assignment->operation_org_id || $user->user_role->org_id === $assignment->org_id) {
            return in_array($user->user_role->role, [
                UserRole::PM, UserRole::ADMIN, UserRole::STAFF, UserRole::CLIENT, UserRole::FINANCE
            ]);
        }

        return $user->can('view', $assignment->project);
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
        // If the user has the right to make changes to the operation organization or contract organization, then they
        // can definitely update the assignment.
        $org = ($assignment->operation_org ?? $assignment->org);
        if ($user->can('update', $org)) {
            return true;
        }

        return $user->can('update', $assignment->project);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Assignment $assignment): bool
    {
        return $user->user_role->org_id === $assignment->org_id && $user->isAnyRole([
            UserRole::ADMIN, UserRole::PM, UserRole::STAFF
        ]);
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

    public function inspect(User $user, Assignment $assignment): bool
    {
        return $assignment->assignment_inspectors()->where('user_id', $user->id)->exists();
    }

    public function reject(User $user, Assignment $assignment): bool
    {
        return $user->user_role->org_id === $assignment->operation_org_id;
    }

    public function invoice(User $user, Assignment $assignment)
    {
        if ($user->user_role->org_id === $assignment->org_id || $assignment->operation_org_id === $user->user_role->org_id) {
            return in_array($user->user_role->role, [
                UserRole::PM,
                UserRole::ADMIN,
                UserRole::FINANCE,
                UserRole::STAFF
            ]);
        }

        return Response::deny('You don\'t have permission to create invoice.');
    }
}
