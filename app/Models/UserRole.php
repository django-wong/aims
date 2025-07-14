<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    /** @use HasFactory<\Database\Factories\UserRoleFactory> */
    use HasFactory, BelongsToOrg, BelongsToUser;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];
}
