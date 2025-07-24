<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model implements Commentable
{
    /** @use HasFactory<\Database\Factories\ProjectFactory> */
    use HasFactory, BelongsToOrg, DynamicPagination, BelongsToClient, HasManyComments, HasManyAssignments;

    protected $guarded = [
        'id', 'created_at', 'updated_at', 'deleted_at'
    ];

    public function project_type()
    {
        return $this->belongsTo(ProjectType::class);
    }
}
