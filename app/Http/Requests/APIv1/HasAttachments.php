<?php

namespace App\Http\Requests\APIv1;

use App\Models\Attachment;

trait HasAttachments
{
    public function hasAttachments(): bool
    {
        return $this->has('attachments') && is_array($this->file('attachments'));
    }

    public function attachments()
    {
        return $this->file('attachments');
    }

    public function saveAttachments($for): void
    {
        if ($this->hasAttachments()) {
            foreach ($this->attachments() as $attachment) {
                Attachment::upload($attachment, $for);
            }
        }
    }
}
