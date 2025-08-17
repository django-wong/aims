<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $org_id
 */
class PurchaseOrder extends Model implements Commentable
{
    /** @use HasFactory<\Database\Factories\PurchaseOrderFactory> */
    use HasFactory, BelongsToClient, BelongsToOrg, DynamicPagination, HasManyAssignments, HasManyComments, HasManyBudgets;

    protected $guarded = [
        'id', 'created_at', 'updated_at'
    ];
}
