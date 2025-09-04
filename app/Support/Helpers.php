<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;

class Helpers
{
    public static function growth_rate($current, $previous): float|int
    {
        if (empty($previous) && !empty($current)) {
            return 1;
        }
        if (!empty($previous) && empty($current)) {
            return -1;
        }
        if (empty($previous) && empty($current)) {
            return 0;
        }
        return ($current - $previous) / $previous;
    }
}
