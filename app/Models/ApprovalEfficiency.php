<?php

namespace App\Models;

class ApprovalEfficiency extends View
{
    use DynamicPagination, BelongsToAssignment, BelongsToTimesheet, BelongsToProject, BelongsToClient;

    protected function casts(): array
    {
        return [
            'avg_hours' => 'integer',
            'max_hours' => 'integer',
            'min_hours' => 'integer',
            'total_approval_in_last_year' => 'integer',
        ];
    }
}
