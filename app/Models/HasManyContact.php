<?php

namespace App\Models;

trait HasManyContact
{
    public function contacts()
    {
        return $this->morphMany(Contact::class, 'contactable');
    }
}
