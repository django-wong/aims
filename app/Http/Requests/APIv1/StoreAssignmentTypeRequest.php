<?php

namespace App\Http\Requests\APIv1;

use App\Models\AssignmentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreAssignmentTypeRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:assignment_types,name',
        ];
    }

    public function authorize(): mixed
    {
        return Gate::authorize('create', AssignmentType::class);
    }
}
