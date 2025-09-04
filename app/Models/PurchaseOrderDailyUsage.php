<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrderDailyUsage extends Model
{
    protected function casts(): array
    {
        return [
            'hours' => 'float',
            'cost' => 'float',
            'travel_distance' => 'float',
            'travel_cost' => 'float',
            'total_expense' => 'float',
            'total_cost' => 'float',
        ];
    }
}
