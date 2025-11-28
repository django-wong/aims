<?php

namespace App\Policies;

use App\Models\NotificationOfInspection;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Gate;

class NotificationOfInspectionPolicy
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
    public function view(User $user, NotificationOfInspection $subject): bool
    {
        return Gate::allows('view', $subject->assignment);
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
    public function add_attachment(User $user, NotificationOfInspection $notificationOfInspection): bool
    {
        // Client or any one who can update the assignment can update the NOI
        return Gate::allows('update', $notificationOfInspection->assignment)
            || $user->client?->id === $notificationOfInspection->client_id;
    }

    public function update(User $user, NotificationOfInspection $notificationOfInspection): bool
    {
        return $user->client?->id === $notificationOfInspection->client_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, NotificationOfInspection $notificationOfInspection): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, NotificationOfInspection $notificationOfInspection): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, NotificationOfInspection $notificationOfInspection): bool
    {
        return false;
    }

    public function send(User $user, NotificationOfInspection $notificationOfInspection): bool
    {
        return $user->client?->is($notificationOfInspection->client) ?? false;
    }
}
