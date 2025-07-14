<?php

namespace App\Models;

trait BelongsToAddress
{
    public function address()
    {
        return $this->belongsTo(Address::class);
    }
}
