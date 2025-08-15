<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasManyContact
{
    public function contacts(): MorphMany
    {
        return $this->morphMany(Contact::class, 'contactable');
    }
}
