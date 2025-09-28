<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimesheetDetail extends Timesheet
{
    use DynamicPagination;

    public function casts(): array
    {
        return [
            'expenses' => 'decimal:2',
            ...parent::casts()
        ];
    }
}
