<?php

namespace App\Models;

trait HasManyComments
{
    public function comments(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
