<?php

namespace App\Http\Requests\APIv1\Assignments;

use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class UpdateRequest extends StoreRequest
{
    public function authorize()
    {
        return Gate::allows('update', $this->route('assignment'));
    }

    public function rules()
    {
        return [
            ...parent::rules(),
            'reference_number' => 'nullable', 'string', 'max:255', Rule::unique('assignments', 'reference_number')->using(
                function(Builder $query) {
                    $query->where('id', '!=', $this->route('assignment')->id);
                }
            )
        ];
    }
}
