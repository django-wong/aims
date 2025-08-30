<?php

namespace App\Policies;

use App\Models\AssignmentInspector;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Gate;

class AssignmentInspectorPolicy
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
    public function view(User $user, AssignmentInspector $assignmentInspector): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, AssignmentInspector $assignmentInspector): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, AssignmentInspector $assignmentInspector): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, AssignmentInspector $assignmentInspector): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, AssignmentInspector $assignmentInspector): bool
    {
        return false;
    }

    public function ack(User $user, AssignmentInspector $assignment_inspector)
    {
        return Gate::allowIf($assignment_inspector->user_id === $user->id, 'Only the assigned inspector can acknowledge this assignment.');
    }
}
