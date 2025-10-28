<?php

namespace App\Values;

use Carbon\Carbon;

class LastMonthRevenue extends CurrentMonthRevenue
{
    public function getStart(): Carbon
    {
        return Carbon::now()->subMonthNoOverflow()->startOfMonth();
    }

    public function getEnd(): Carbon
    {
        return Carbon::now()->subMonthNoOverflow()->endOfMonth();
    }
}
