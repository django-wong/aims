<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectType extends Model
{
    /** @use HasFactory<\Database\Factories\ProjectTypeFactory> */
    use HasFactory, DynamicPagination;

    protected $guarded = [
        'id', 'created_at', 'updated_at', 'deleted_at'
    ];
}
