<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ManHoursByYear extends Model
{
    use DynamicPagination;

    protected function casts(): array
    {
        return [
            'hours' => 'json'
        ];
    }
}
