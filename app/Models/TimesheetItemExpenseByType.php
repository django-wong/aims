<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimesheetItemExpenseByType extends View
{
    use DynamicPagination;

    protected function casts(): array
    {
        return [
            'expenses_by_type' => 'array',
        ];
    }
}
