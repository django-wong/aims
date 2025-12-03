<?php

namespace App\Policies;

use App\Models\InspectorProfile;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Auth\Access\Response;

class InspectorProfilePolicy
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
    public function view(User $user, InspectorProfile $inspectorProfile): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, ?User $for_user = null): bool
    {
        $allow = $user->isAnyRole([
            UserRole::ADMIN, UserRole::PM, UserRole::STAFF
        ]);

        if ($allow && $for_user) {
            if ($user->user_role->org_id !== $for_user->user_role->org_id) {
                return false;
            }
        }

        return $allow;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, InspectorProfile $inspectorProfile): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, InspectorProfile $inspectorProfile): bool
    {
        if ($user->user_role->org_id === $inspectorProfile->user->user_role->org_id) {
            return $user->isAnyRole([
                UserRole::ADMIN
            ]);
        }
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, InspectorProfile $inspectorProfile): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, InspectorProfile $inspectorProfile): bool
    {
        return false;
    }
}
