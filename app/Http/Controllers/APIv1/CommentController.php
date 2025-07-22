<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\Comments\IndexRequest;
use App\Http\Requests\Comments\StoreRequest;
use App\Models\Attachment;
use App\Models\Comment;
use Illuminate\Support\Facades\Gate;

class CommentController extends Controller
{
    protected function allowedIncludes()
    {
        return [
            'attachments', 'commentable', 'user',
        ];
    }

    protected function allowedSorts()
    {
        return [
            'created_at', 'updated_at'
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(IndexRequest $request)
    {
        $commentable = $request->commentable();

        Gate::authorize('view', $commentable);

        return $this->getQueryBuilder()->visible()->whereMorphedTo('commentable', $commentable)->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $commentable = $request->commentable();

        if (empty($commentable)) {
            abort(404, 'Commentable resource not found.');
        }

        Gate::authorize(
            'create', [Comment::class, $commentable]
        );

        /**
         * @var Comment $comment
         */
        $comment = $commentable->comments()->create($request->basic());

        if (! empty($attachments = $request->file('attachments'))) {
            foreach ($attachments as $attachment) {
                Attachment::upload(
                    $attachment, for: $comment
                );
            }
        }

        return response()->json([
            'data' => $comment
                ->refresh()
                ->load('attachments', 'commentable')
        ]);
    }
}
