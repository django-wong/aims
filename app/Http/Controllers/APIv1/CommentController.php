<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\Comments\IndexRequest;
use App\Http\Requests\APIv1\Comments\StoreRequest;
use App\Models\Attachment;
use App\Models\Comment;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Facades\Gate;
use Spatie\QueryBuilder\AllowedFilter;

class CommentController extends Controller
{
    protected function allowedFilters()
    {
        return [
            AllowedFilter::callback('attachments', function (Builder $query, $value) {
                if ($value === '1') {
                    $query->whereHas('attachments');
                }
            })
        ];
    }

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

        if (!empty($attachments = $request->file('attachments'))) {
            foreach ($attachments as $attachment) {
                Attachment::store(
                    $attachment, attachable: $comment
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
