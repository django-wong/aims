<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\Attachments\StoreRequest;
use App\Http\Requests\APIv1\IndexAttachmentRequest;
use App\Http\Requests\APIv1\UpdateAttachmentRequest;
use App\Models\Attachment;
use App\Models\Comment;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AttachmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(IndexAttachmentRequest $request)
    {
        return $this->getQueryBuilder()->tap(function (Builder $query) use ($request) {
            $query->whereMorphedTo('attachable', $request->attachable());
        })->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $attachable = $request->attachable();

        if (empty($attachable)) {
            abort(404, 'Attachable resource not found.');
        }

        Gate::authorize('create', [Attachment::class, $attachable]);

        if (!empty($attachments = $request->file('attachments'))) {
            foreach ($attachments as $attachment) {
                Attachment::store(
                    $attachment, attachable: $attachable
                );
            }
        }

        return response()->json([
            'message' => 'Attachment(s) uploaded successfully.'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttachmentRequest $request, Attachment $attachment)
    {
        $attachment->revision($request->file('attachment'))->save();

        return [
            'message' => 'Attachment updated successfully.',
            'data' => $attachment->fresh()
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attachment $attachment)
    {
        Gate::authorize('delete', $attachment);

        $attachment->delete();

        return [
            'message' => 'Attachment deleted successfully.'
        ];
    }
}
