<?php

namespace App\Values;

use App\Models\TimesheetItem;
use Carbon\Carbon;

class CurrentMonthRevenue extends Value
{
    public function getStart(): Carbon
    {
        return Carbon::now()->startOfMonth();
    }

    public function getEnd(): Carbon
    {
        return Carbon::now()->endOfMonth();
    }

    public function value()
    {
        $result = TimesheetItem::query()->whereBetween('date', [$this->getStart(), $this->getEnd()])->selectRaw('SUM(cost + travel_cost) - SUM(hour_fee + travel_fee) as diff')->first();

        return $result->diff ?? 0;
    }
}
