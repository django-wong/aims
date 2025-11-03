<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property integer    $org_id
 * @property User|null  $coordinator
 * @property int|null   $address_id
 * @property User       $user
 * @property User|null  $reviewer
 * @property Org        $org
 * @property int $id
 */
class Client extends Model implements Contactable, Invoiceable, Commentable
{
    /** @use HasFactory<\Database\Factories\ClientFactory> */
    use HasFactory, DynamicPagination, BelongsToOrg, BelongsToUser, HasManyContact, BelongsToAddress, HasManyContact;
    use HasManyComments;

    protected $guarded = [
        'id', 'updated_at', 'created_at'
    ];

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function coordinator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'coordinator_id');
    }

    public function getInvoiceName(): string
    {
        return $this->business_name;
    }

    public function getInvoiceAddress(): ?string
    {
        return $this->address->full_address ?? null;
    }
}
