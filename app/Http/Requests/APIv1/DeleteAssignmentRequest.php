<?php

namespace App\Http\Requests\APIv1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class DeleteAssignmentRequest extends FormRequest
{
    public function authorize(): \Illuminate\Auth\Access\Response
    {
        return Gate::authorize('delete', $this->route('assignment'));
    }
}
