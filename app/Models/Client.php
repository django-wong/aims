<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    /** @use HasFactory<\Database\Factories\ClientFactory> */
    use HasFactory, DynamicPagination, BelongsToOrg, BelongsToUser, HasManyContact, BelongsToAddress;

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function coordinator()
    {
        return $this->belongsTo(User::class, 'coordinator_id');
    }
}
