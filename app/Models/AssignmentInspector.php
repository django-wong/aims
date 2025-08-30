<?php

namespace App\Models;

use App\Notifications\NewAssignmentIssued;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property mixed                            $hourly_rate
 * @property mixed                            $travel_rate
 * @property int                              $user_id
 * @property \Illuminate\Support\Carbon|mixed $acked_at
 * @property string                            $signature_base64
 */
class AssignmentInspector extends Model
{
    /** @use HasFactory<\Database\Factories\AssignmentInspectorFactory> */
    use HasFactory, BelongsToUser, BelongsToAssignment, BelongsToAssignmentType;

    protected $guarded = [
        'id'
    ];

    protected $casts = [
        'acked_at' => 'datetime',
    ];

    protected static function booted()
    {
        static::created(function (self $item) {
            if ($item->user_id) {
                $item->user->notify(
                    new NewAssignmentIssued($item->assignment)
                );
            }
        });
    }
}
