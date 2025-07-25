<?php

namespace App\Http\Requests\APIv1\Comments;

use App\Models\Commentable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'commentable_type' => 'required|string',
            'commentable_id' => 'required|integer',

            'content' => 'required|string|max:5000',
            'private' => 'boolean',

            'attachments' => 'array',
            'attachments.*' => 'file|max:512000', // 500 MB
        ];
    }

    public function commentable(): Commentable | null
    {
        /**
         * @var class-string<Model> $class
         */
        $class = '\\App\\Models\\' . ucfirst($this->validated('commentable_type'));
        $id = $this->validated('commentable_id');
        return $class::query()->findOrFail($id);
    }

    public function basic(): array
    {
        return [
            'content' => $this->validated('content'),
            'private' => $this->validated('private', false),
            'user_id' => $this->user()->id,
        ];
    }
}
