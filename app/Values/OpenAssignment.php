<?php

namespace App\Values;

use App\Models\Assignment;

class OpenAssignment extends Value
{
    public function value(): int
    {
        return Assignment::query()->scoped()->open()->count();
    }
}
