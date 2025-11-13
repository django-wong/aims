<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class LateReport extends Model
{
    use DynamicPagination;

    protected function casts(): array
    {
        return [
            'report_submitted_at' => 'datetime',
            'earliest_visit_date' => 'date',
            'report_required' => 'boolean'
        ];
    }

    public function scopeVisible($query)
    {
        return $query->where(function (Builder $query) {
            $org = auth()->user()->user_role->org_id;
            $query->where('org_id', $org)->orWhere('operation_org_id', $org);
        });
    }
}
