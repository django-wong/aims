<?php

namespace App\Http\Requests\APIv1;

use App\Models\AssignmentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateAssignmentTypeRequest extends FormRequest
{
    public function rules(): array
    {
        $id = $this->route('assignment_type')->id;

        return [
            'name' => 'required|string|max:255|unique:assignment_types,name,' . $id,
        ];
    }

    public function authorize()
    {
        return Gate::authorize('update', $this->route('assignment_type'));
    }
}
