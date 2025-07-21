<?php

namespace App\Models;

trait BelongsToClient
{
    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
