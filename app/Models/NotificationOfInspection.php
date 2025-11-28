<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property Assignment   $assignment
 * @property Attachment[] $attachments
 * @property int          $org_id
 * @property int          $client_id
 * @property int          $status
 * @property string|null        $rejection_reason
 * @property \Illuminate\Support\Carbon $from
 * @property \Illuminate\Support\Carbon $to
 */
class NotificationOfInspection extends Model implements Attachable
{
    /** @use HasFactory<\Database\Factories\NotificationOfInspectionFactory> */
    use HasFactory, BelongsToAssignment, HasManyAttachments, DynamicPagination, BelongsToOrg, BelongsToClient;

    const DRAFT = 0; // Client need to send to coordinating office
    const REQUESTED = 1; // Coordinating office need to take action
    const ACCEPTED = 2; // Coordinating office accepted the request [final]
    const REJECTED = 3; // Coordinating office rejected the request with proposed changes
    const CLIENT_REJECTED = 4; // Client rejected the proposed changes with optional changes
    const CLIENT_ACCEPTED = 5; // Client accepted the proposed changes [final]

    protected $guarded = [
        'id', 'created_at', 'updated_at', 'deleted_at'
    ];

    protected function casts(): array
    {
        return [
            'from' => 'datetime',
            'to' => 'datetime',
            'proposed_from' => 'datetime',
            'proposed_to' => 'datetime',
        ];
    }

    public function inspector(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'inspector_id');
    }
}
