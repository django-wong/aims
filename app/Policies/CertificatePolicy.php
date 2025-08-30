<?php

namespace App\Policies;

use App\Models\Certificate;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Auth\Access\Response;

class CertificatePolicy
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
    public function view(User $user, Certificate $certificate): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, User $for): bool
    {
        return $user->isAnyRole([
            UserRole::STAFF,
            UserRole::ADMIN,
            UserRole::FINANCE,
            UserRole::PM,
        ]) && $user->user_role->org()->is($for->user_role->org);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Certificate $certificate): bool
    {
        return $this->create($user, $certificate->user);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Certificate $certificate): bool
    {
        return $this->update($user, $certificate);
    }
}
