<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property PurchaseOrder $purchase_order
 */
class Budget extends Model
{
    /** @use HasFactory<\Database\Factories\BudgetFactory> */
    use HasFactory, BelongsToPurchaseOrder, BelongsToAssignmentType, DynamicPagination;

    protected $guarded = [
        'id'
    ];
}
