<?php

namespace App\Models;

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
}
