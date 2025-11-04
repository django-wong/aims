<?php

namespace App\Values;

use App\Models\Assignment;

class ClosedAssignment extends Value
{
    public function value(): int
    {
        return Assignment::query()->scoped()->whereNotNull('close_date')->count();
    }
}
