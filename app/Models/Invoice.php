<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\JoinClause;

/**
 * @property PurchaseOrder                    $purchase_order
 * @property Org                              $org
 * @property User|null                        $notifiable
 * @property string                           $invoiceable_type
 * @property string                           $invoiceable_id
 * @property User                             $user
 * @property \Illuminate\Support\Carbon|mixed $reminder_sent_at
 * @property int                              $org_id
 * @property string|null                      $rejection_reason
 * @property int                              $id
 * @property int                            $purchase_order_id
 */
class Invoice extends Model implements Commentable
{
    /** @use HasFactory<\Database\Factories\InvoiceFactory> */
    use HasFactory, BelongsToPurchaseOrder, DynamicPagination, HasManyComments, BelongsToOrg, BelongsToUser;

    const DRAFT = 0;
    const SENT = 1;
    const REJECTED = 2;
    const APPROVED = 3;
    const PAID = 4;

    protected $guarded = [
        'id', 'created_at', 'updated_at', 'deleted_at'
    ];

    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
            'reminder_sent_at' => 'datetime',
        ];
    }

    public function invoiceable(): \Illuminate\Database\Eloquent\Relations\MorphTo
    {
        return $this->morphTo();
    }

    protected function notifiable(): Attribute
    {
        return Attribute::make(
            get: function ($value, $attributes) {
                return $attributes['invoiceable_type'] === Client::class
                    ? $this->purchase_order?->project?->client?->user
                    : $this->purchase_order?->project?->client?->coordinator;
            },
        );
    }
}
