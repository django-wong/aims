<?php

namespace App\Http\Requests\APIv1\Comments;

class IndexRequest extends StoreRequest
{
    public function rules(): array
    {
        return [
            'commentable_type' => 'required|string',
            'commentable_id' => 'required|integer',
        ];
    }
}
