<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $org_id
 */
class Quote extends Model implements Commentable
{
    /** @use HasFactory<\Database\Factories\QuoteFactory> */
    use HasFactory, BelongsToOrg, BelongsToClient, HasManyComments;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    public function quote_client(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Client::class, 'quote_client_id');
    }
}
