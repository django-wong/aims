<?php

namespace App\Models;

trait HasManyComments
{
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
