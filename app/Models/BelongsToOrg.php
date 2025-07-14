<?php

namespace App\Models;

trait BelongsToOrg
{
    public function org()
    {
        return $this->belongsTo(Org::class);
    }
}
