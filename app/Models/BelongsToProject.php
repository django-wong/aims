<?php

namespace App\Models;

trait BelongsToProject
{
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
