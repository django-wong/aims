<?php

namespace App\Http\Requests\APIv1\Attachments;

use App\Models\Attachable;
use App\Models\Commentable;
use App\Support\ModelResolver;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    public function attachable(): Attachable | null
    {
        /**
         * @var class-string<Model> $class
         */
        $class = ModelResolver::for($this->validated('attachable_type'));
        $id = $this->validated('attachable_id');
        return $class::query()->findOrFail($id);
    }

    public function rules(): array
    {
        return [
            'attachable_type' => 'required|string',
            'attachable_id' => 'required|integer',
            'attachments' => 'required|array',
            'attachments.*' => 'file',
        ];
    }
}
