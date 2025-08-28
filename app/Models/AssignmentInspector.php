<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignmentInspector extends Model
{
    /** @use HasFactory<\Database\Factories\AssignmentInspectorFactory> */
    use HasFactory, BelongsToUser, BelongsToAssignment;
}
