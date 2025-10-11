<?php

namespace App\Policies;

use App\Models\Quote;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Gate;

class QuotePolicy
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
    public function view(User $user, Quote $quote): bool
    {
        return $quote->org_id == $user->user_role->org_id && $user->isAnyRole([
            UserRole::ADMIN,
            UserRole::STAFF,
            UserRole::PM,
            UserRole::FINANCE
        ]);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isAnyRole([
            UserRole::ADMIN,
            UserRole::STAFF,
            UserRole::PM,
            UserRole::FINANCE
        ]);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Quote $quote): bool
    {
        return $user->user_role->org_id === $quote->org_id && Gate::allows('create', Quote::class);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Quote $quote): bool
    {
        return $user->user_role->org_id === $quote->org_id && Gate::allows('create', Quote::class);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Quote $quote): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Quote $quote): bool
    {
        return $this->delete($user, $quote);
    }
}
