<?php

namespace App\Policies;

use App\Models\Budget;
use App\Models\PurchaseOrder;
use App\Models\User;

class BudgetPolicy
{
    public function create(User $user, PurchaseOrder $purchase_order)
    {
        return $user->can('update', $purchase_order);
    }

    public function update(User $user, Budget $budget)
    {
        return $user->can('update', $budget->purchase_order);
    }

    public function delete(User $user, Budget $budget)
    {
        return $user->can('update', $budget->purchase_order);
    }
}
