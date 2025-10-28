<?php

namespace App\Values;

use Carbon\Carbon;

class CurrentYearRevenue extends CurrentMonthRevenue
{
    public function getEnd(): Carbon
    {
        return Carbon::now()->endOfYear();
    }

    public function getStart(): Carbon
    {
        return Carbon::now()->startOfYear();
    }
}
