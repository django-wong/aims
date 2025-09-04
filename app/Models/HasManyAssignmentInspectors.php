<?php

namespace App\Models;

trait HasManyAssignmentInspectors
{
    public function assignment_inspectors()
    {
        return $this->hasMany(AssignmentInspector::class);
    }

    public function assignment_inspector()
    {
        return $this->hasOne(AssignmentInspector::class)->where('user_id', auth()->id());
    }
}
