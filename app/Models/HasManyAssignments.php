<?php

namespace App\Models;

trait HasManyAssignments
{
    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }
}
