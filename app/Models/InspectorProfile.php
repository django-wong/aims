<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property numeric                                              $hourly_rate
 * @property numeric                                              $travel_rate
 * @property bool                                                 $include_on_skills_matrix
 * @property User                                                 $user
 * @property numeric      $address_id
 */
class InspectorProfile extends Model
{
    /** @use HasFactory<\Database\Factories\InspectorProfileFactory> */
    use HasFactory, BelongsToUser, BelongsToAddress, DynamicPagination;

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
