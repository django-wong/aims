<?php

namespace App\Policies;

use App\Models\AssignmentType;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Auth\Access\Response;

class AssignmentTypePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, AssignmentType $assignmentType): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isAnyRole([
            UserRole::ADMIN
        ]);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, AssignmentType $assignmentType): bool
    {
        return $user->isAnyRole([
            UserRole::ADMIN
        ]);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, AssignmentType $assignmentType): bool
    {
        return $user->isAnyRole([
            UserRole::ADMIN
        ]);
    }
}
