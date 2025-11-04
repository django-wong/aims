<?php

namespace App\Values;

use App\Models\PurchaseOrder;
use App\Models\UserRole;
use Illuminate\Database\Eloquent\Builder;

class CountOfPurchaseOrders extends Value
{
    public function value(): int
    {
        return PurchaseOrder::query()->tap(function (Builder $query) {
            $user = auth()->user();
            if ($user->isRole(UserRole::CLIENT)) {
                $query->whereIn('purchase_orders.project_id', function ($subquery) use ($user) {
                    $subquery->select('id')
                        ->from('projects')
                        ->where('client_id', $user->client?->id ?? 0);
                });
            } else {
                $query->where('purchase_orders.org_id', $user->user_role->org_id);
            }
        })->count();
    }
}
