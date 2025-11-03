<?php

namespace App\Policies;

use App\Models\CertificateType;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Auth\Access\Response;

class CertificateTypePolicy
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
    public function view(User $user, CertificateType $certificateType): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isAnyRole([UserRole::ADMIN]);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, CertificateType $certificateType): bool
    {
        return $user->isAnyRole([UserRole::ADMIN]);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CertificateType $certificateType): bool
    {
        return $user->isAnyRole([UserRole::ADMIN]);
    }
}
