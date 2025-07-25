<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignmentType extends Model
{
    /** @use HasFactory<\Database\Factories\AssignmentTypeFactory> */
    use HasFactory, HasManyAssignments, BelongsToOrg, DynamicPagination;

    public function scopeVisible(Builder $query, Org|int|null $org = null)
    {
        $orgId = is_null($org) ? auth()->user()->org->id : (is_int($org) ? $org : $org->id);

        return $query->where(function ($query) use ($orgId) {
            $query->where('org_id', $orgId)->orWhereNull('org_id');
        });
    }
}
