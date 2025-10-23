<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HoursEntry extends Model
{
    use DynamicPagination;

    protected $casts = [
        'expenses_by_type' => 'array',
    ];
}
