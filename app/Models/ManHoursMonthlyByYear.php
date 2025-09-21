<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ManHoursMonthlyByYear extends View
{
    use DynamicPagination;

    protected function casts(): array
    {
        return [
            'monthly_hours' => 'json',
            'year' => 'float',
            'total_hours' => 'float',
        ];
    }
}
