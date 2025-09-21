<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class View extends Model
{
    use DynamicPagination;

    protected static function booted()
    {
        static::saving(function () {
            throw new \Exception("You cannot save a view model.");
        });
    }
}
