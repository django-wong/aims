<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;

trait BelongsToOrg
{
    public function org()
    {
        return $this->belongsTo(Org::class);
    }

    public function scopeScoped(Builder $query, Org|int|null $org = null)
    {
        $orgId = is_null($org) ? auth()->user()->org->id : (is_int($org) ? $org : $org->id);
        if (is_null($orgId)) {
            return $query->whereNull('org_id');
        }
        return $query->where('org_id', $orgId);
    }
}
