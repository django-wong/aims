<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;

/**
 * @property Client $client
 * @property Org    $org
 * @property int    $org_id
 * @property int    $id
 * @property Collection<PurchaseOrder>  $purchase_orders
 */
class Project extends Model implements Commentable
{
    /** @use HasFactory<\Database\Factories\ProjectFactory> */
    use HasFactory, BelongsToOrg, DynamicPagination, BelongsToClient, HasManyComments, HasManyAssignments, SoftDeletes, HasManyPurchaseOrders;

    protected $guarded = [
        'id', 'created_at', 'updated_at', 'deleted_at'
    ];

    public function project_type()
    {
        return $this->belongsTo(ProjectType::class);
    }
}
