<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int   $org_id
 * @property int $id
 */
class PurchaseOrder extends Model implements Commentable
{
    /** @use HasFactory<\Database\Factories\PurchaseOrderFactory> */
    use HasFactory, BelongsToProject, DynamicPagination, HasManyAssignments, HasManyComments, HasManyBudgets, BelongsToOrg;

    protected $guarded = [
        'id', 'created_at', 'updated_at'
    ];

    protected static function booted()
    {
        static::updating(function (PurchaseOrder $purchase_order) {
            if ($purchase_order->isDirty('title')) {
                $purchase_order->previous_title = implode(', ', array_filter([$purchase_order->previous_title, $purchase_order->getOriginal('title')]));
            }
        });
    }
}
