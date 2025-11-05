<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\PurchaseOrder;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Auth\Access\Response;

class PurchaseOrderPolicy
{
    public function viewAny(User $user): bool
    {
        return false;
    }

    public function view(User $user, PurchaseOrder $purchaseOrder): bool
    {
        if ($purchaseOrder->project?->client?->user?->id === $user->id) {
            return true;
        }

        $role = $user->isAnyRole([
            UserRole::ADMIN,
            UserRole::PM,
            UserRole::FINANCE,
            UserRole::STAFF,
        ]);

        return $user->org->id === $purchaseOrder->org_id && $role;
    }

    public function create(User $user): bool
    {
        return $user->isAnyRole([
            UserRole::ADMIN,
            UserRole::STAFF,
            UserRole::PM,
            UserRole::FINANCE,
        ]);
    }

    public function update(User $user, PurchaseOrder $purchaseOrder): bool
    {
        return $user->user_role->org_id === $purchaseOrder->org_id
            && $this->create($user);
    }

    public function delete(User $user, PurchaseOrder $purchaseOrder): bool
    {
        return $this->update($user, $purchaseOrder);
    }
}
