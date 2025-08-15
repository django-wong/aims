<?php

namespace App\Http\Requests\APIv1\Contacts;

use App\Models\Contactable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;

class IndexRequest extends FormRequest
{
    public function contactable(): Contactable | null
    {
        /**
         * @var class-string<Model> $class
         */
        $class = '\\App\\Models\\' . ucfirst($this->validated('contactable_type'));
        $id = $this->validated('contactable_id');
        return $class::query()->findOrFail($id);
    }

    public function rules(): array
    {
        return [
            'contactable_id' => 'integer|required',
            'contactable_type' => 'string|required',
        ];
    }
}
