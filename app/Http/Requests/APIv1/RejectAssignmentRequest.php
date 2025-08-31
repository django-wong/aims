<?php

namespace App\Http\Requests\APIv1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class RejectAssignmentRequest extends FormRequest
{
    public function authorize(): \Illuminate\Auth\Access\Response
    {
        return  Gate::authorize('reject', $this->route('assignment'));
    }

    public function rules(): array
    {
        return [
            'message' => ['required', 'string'],
        ];
    }
}
