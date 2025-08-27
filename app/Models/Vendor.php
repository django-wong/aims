<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vendor extends Model implements Contactable
{
    /** @use HasFactory<\Database\Factories\VendorFactory> */
    use HasFactory, DynamicPagination, BelongsToOrg, BelongsToAddress, HasManyContact;

    protected $guarded = [
        'id', 'created_at', 'updated_at'
    ];

    public function scopeVisiable(Builder $query)
    {
        return $query->where('org_id', auth()->user()->user_role->id);
    }
}
