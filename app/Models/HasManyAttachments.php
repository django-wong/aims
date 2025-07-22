<?php

namespace App\Models;

use Illuminate\Support\Str;

trait HasManyAttachments
{
    public function attachments(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    public function getPathPrefix(): string
    {
        return strtolower(class_basename($this));
    }
}
