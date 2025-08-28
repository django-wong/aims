<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\PurchaseOrder;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Auth\Access\Response;

class PurchaseOrderPolicy
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
    public function view(User $user, PurchaseOrder $purchaseOrder): bool
    {
        // Check if user and purchase order belong to the same organization
        if ($user->org->id !== $purchaseOrder->org_id) {
            return false;
        }

        // Deny access if the user is an inspector
        if ($user->user_role && $user->user_role->role === UserRole::INSPECTOR) {
            return false;
        }

        // Allow all other users from the same org
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Project|null $project = null): bool
    {
        // Allow admin, finance, and staff users to create purchase orders
        if ($user->user_role && in_array($user->user_role->role, [
            UserRole::ADMIN,
            UserRole::FINANCE,
            UserRole::STAFF
        ])) {
            if ($project) {
                return $user->user_role->org()->is($project->org);
            }
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, PurchaseOrder $purchaseOrder): bool
    {
        return $this->view($user, $purchaseOrder);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, PurchaseOrder $purchaseOrder): bool
    {
        return $this->update($user, $purchaseOrder);
    }
}
