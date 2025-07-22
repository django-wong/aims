<?php

namespace App\Models;

interface Attachable
{
    public function attachments(): \Illuminate\Database\Eloquent\Relations\MorphMany;

    public function getPathPrefix(): string;
}
