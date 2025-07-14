<?php

namespace App\Models;

trait HasOneContact
{
    public function contact()
    {
        return $this->hasOne(Contact::class);
    }
}
