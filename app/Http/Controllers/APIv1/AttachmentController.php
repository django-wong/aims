<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\Attachments\StoreRequest;
use App\Models\Attachment;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AttachmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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

        Gate::authorize(
            'create', [Attachment::class, $attachable]
        );

        if (! empty($attachments = $request->file('attachments'))) {
            foreach ($attachments as $attachment) {
                Attachment::upload(
                    $attachment, for: $attachable
                );
            }
        }

        return response()->json([
            'message' => 'Attachment(s) uploaded successfully.'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Attachment $attachment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Attachment $attachment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attachment $attachment)
    {
        //
    }
}
