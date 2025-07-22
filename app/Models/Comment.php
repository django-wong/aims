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

    public function commentable(): \Illuminate\Database\Eloquent\Relations\MorphTo
    {
        return $this->morphTo();
    }

    public function scopeVisible($query, User|int|null $to = null): Builder
    {
        return $query->where(function (Builder $query) use ($to) {
            $id = $to instanceof User ? $to->id : $to;

            if (is_null($id)) {
                $id = auth()->id();
            }

            $query->where('private', false)->orWhere('user_id', $id);
        });
    }
}
