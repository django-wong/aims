<?php

namespace App\Models;

trait HasManyPurchaseOrders
{
    public function purchase_orders()
    {
        return $this->hasMany(PurchaseOrder::class);
    }
}
