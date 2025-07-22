<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use Illuminate\Support\Facades\Gate;

class AttachmentController
{
    public function download($id)
    {
        $attachment = Attachment::query()->findOrFail($id);

        Gate::authorize('view', $attachment);

        return $attachment->download();
    }
}
