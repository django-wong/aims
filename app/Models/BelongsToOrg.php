<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;

trait BelongsToOrg
{
    public function scopeScoped(Builder $query, Org|int|null $org = null)
    {
        $orgId = is_null($org) ? auth()->user()->org->id : (is_int($org) ? $org : $org->id);

        return $query->where('org_id', $orgId);
    }

    public function org()
    {
        return $this->belongsTo(Org::class);
    }
}
