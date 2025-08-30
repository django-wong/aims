<?php

namespace App\Policies;

use App\Models\Attachable;
use App\Models\Attachment;
use App\Models\User;

class AttachmentPolicy
{
    /**
     * Determine whether the user can view the comment.
     */
    public function view(User $user, Attachment $attachment): bool
    {
        return $user->can('view', $attachment->attachable);
    }

    public function create(User $user, Attachable $attachable): bool
    {
        return $user->can('update', $attachable) || $user->can('add_attachment', $attachable);
    }
}
