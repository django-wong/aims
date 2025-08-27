<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    /** @use HasFactory<\Database\Factories\SkillFactory> */
    use HasFactory, DynamicPagination;

    protected $guarded = [
        'id', 'created_at', 'updated_at'
    ];

    public function users()
    {
        return $this->belongsToMany(
            User::class, 'user_skills', 'skill_id', 'user_id'
        );
    }
}
