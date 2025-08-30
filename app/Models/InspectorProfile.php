<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InspectorProfile extends Model
{
    /** @use HasFactory<\Database\Factories\InspectorProfileFactory> */
    use HasFactory, BelongsToUser, BelongsToAddress;

    protected $guarded = [
        'id', 'user_id'
    ];

    protected function casts(): array
    {
        return [
            'include_on_skills_matrix' => 'boolean',
        ];
    }
}
