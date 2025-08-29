<?php

namespace App\Models;

trait HasManyAssignmentInspectors
{
    public function assignment_inspectors()
    {
        return $this->hasMany(AssignmentInspector::class);
    }
}
