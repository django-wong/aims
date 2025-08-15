<?php

namespace App\Models;

interface Contactable
{
    public function contacts(): \Illuminate\Database\Eloquent\Relations\MorphMany;
}
