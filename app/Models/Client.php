<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property integer    $org_id
 * @property User|null  $coordinator
 * @property int|null   $address_id
 * @property User       $user
 * @property User|null $reviewer
 */
class Client extends Model implements Contactable
{
    /** @use HasFactory<\Database\Factories\ClientFactory> */
    use HasFactory, DynamicPagination, BelongsToOrg, BelongsToUser, HasManyContact, BelongsToAddress, HasManyContact;

    protected $guarded = [
        'id', 'updated_at', 'created_at'
    ];

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function coordinator(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'coordinator_id');
    }
}
