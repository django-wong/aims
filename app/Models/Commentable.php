<?php

namespace App\Models;

interface Commentable
{
    /**
     * Get the comments for the model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany
     */
    public function comments();
}
