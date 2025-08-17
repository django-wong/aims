<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToAssignmentType
{
    public function assignment_type(): BelongsTo
    {
        return $this->belongsTo(AssignmentType::class);
    }
}
