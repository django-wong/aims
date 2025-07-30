<?php

namespace App\Policies;

use App\Models\Assignment;
use App\Models\TimesheetItem;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Auth\Access\Response;

class TimesheetItemPolicy
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
    public function view(User $user, TimesheetItem $timesheetItem): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Assignment|null $assignment = null): bool
    {
        if (!empty($assignment->inspector_id)) {
            return $assignment->inspector_id === $user->id;
        }
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, TimesheetItem $timesheetItem): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, TimesheetItem $timesheetItem): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, TimesheetItem $timesheetItem): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, TimesheetItem $timesheetItem): bool
    {
        return false;
    }
}
