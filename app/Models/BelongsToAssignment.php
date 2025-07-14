<?php

namespace App\Models;

trait BelongsToAssignment
{
    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }
}
