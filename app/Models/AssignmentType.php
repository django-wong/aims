<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignmentType extends Model
{
    /** @use HasFactory<\Database\Factories\AssignmentTypeFactory> */
    use HasFactory, HasManyAssignments, BelongsToOrg, DynamicPagination;
}
