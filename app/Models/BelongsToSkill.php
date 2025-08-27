<?php

namespace App\Models;

trait BelongsToSkill
{
    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }
}
