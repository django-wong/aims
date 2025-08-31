<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model implements Attachable
{
    /** @use HasFactory<\Database\Factories\CommentFactory> */
    use HasFactory, HasManyAttachments, BelongsToUser;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    public static function quick(string $content, Assignment $for)
    {
        $data = [
            'content' => $content,
            'user_id' => auth()->id(),
            'private' => false,
        ];

        return $for->comments()->create($data);
    }

    public function commentable(): \Illuminate\Database\Eloquent\Relations\MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Scope a query to only include visible comments.
     * For inspectors, only their own comments are visible.
     * For other roles, public comments and their own comments are visible.
     * Private comments only visible to the author.
     *
     * @param               $query
     * @param User|int|null $to
     * @return Builder
     */
    public function scopeVisible($query, User|int|null $to = null): Builder
    {
        return $query->where(function (Builder $query) use ($to) {
            $id = $to instanceof User ? $to->id : $to;

            if (is_null($id)) {
                $id = auth()->id();
            }

            if (User::query()->find($id)->isRole(UserRole::INSPECTOR)) {
                $query->where('user_id', $id);
                return;
            }

            $query->where(function ($query) use ($id) {
                $query->where('private', false)->orWhere('user_id', $id);
            });
        });
    }
}
