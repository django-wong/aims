<?php

namespace App\Models;

trait BelongsToPurchaseOrder
{
    public function purchase_order(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(PurchaseOrder::class, 'purchase_order_id');
    }
}
