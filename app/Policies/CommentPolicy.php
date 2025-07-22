<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\Commentable;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

class CommentPolicy
{
    /**
     * Determine whether the user can view any comments.
     */
    public function create(User $user, Commentable $commentable): bool
    {
        return $user->can('view', $commentable);
    }

    /**
     * Determine whether the user can create comments.
     */
    public function update(User $user, Comment $comment): bool
    {
        return $user->id === $comment->user_id;
    }

    /**
     * Determine whether the user can delete the comment.
     */
    public function view(User $user, Comment $comment): bool
    {
        return Gate::allows(
            'view', $comment->commentable
        );
    }
}

