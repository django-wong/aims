<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

/**
 * @property int     $org_id
 * @property int     $id
 * @property float   $usage
 * @property int     $total_hours
 * @property int     $budgeted_hours
 * @property Project $project
 * @property string  $title
 */
class PurchaseOrder extends Model implements Commentable
{
    /** @use HasFactory<\Database\Factories\PurchaseOrderFactory> */
    use HasFactory, BelongsToProject, DynamicPagination, HasManyAssignments, HasManyComments, HasManyBudgets, BelongsToOrg;

    protected $guarded = [
        'id', 'created_at', 'updated_at'
    ];

    protected function casts(): array
    {
        return [
            'first_alert_at' => 'datetime',
            'second_alert_at' => 'datetime',
            'final_alert_at' => 'datetime'
        ];
    }

    protected static function booted()
    {
        static::updating(function (PurchaseOrder $purchase_order) {
            if ($purchase_order->isDirty('title')) {
                $purchase_order->previous_title = implode(', ', array_filter([$purchase_order->previous_title, $purchase_order->getOriginal('title')]));
            }
        });
    }

    public function scopeVisible(Builder $query)
    {
        if (Auth::isClient()) {
            $query->whereIn('project_id', Project::query()->select('id')->where('client_id', auth()->user()->client->id));
            return $query;
        } else {
            $query->where(function (Builder $query) {
                $org = auth()->user()->user_role->org_id;
                $query->where('org_id', $org)
                    ->orWhereIn(
                        'id', Assignment::query()->select('purchase_order_id')->where('operation_org_id', $org)
                    );
            });
        }

        return $query;
    }
}
