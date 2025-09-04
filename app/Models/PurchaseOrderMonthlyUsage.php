<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * @property float $total_expense
 * @property float $hours
 * @property float $total_cost
 * @property float $travel_distance
 */
class PurchaseOrderMonthlyUsage extends Model
{
    protected function casts(): array
    {
        return [
            'hours' => 'float',
            'cost' => 'float',
            'travel_distance' => 'float',
            'travel_cost' => 'float',
            'total_expense' => 'float',
            'total_cost' => 'float'
        ];
    }
}
