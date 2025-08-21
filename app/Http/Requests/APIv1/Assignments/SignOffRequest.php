<?php

namespace App\Http\Requests\APIv1\Assignments;

use App\Models\Assignment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class SignOffRequest extends FormRequest
{
    public function assignment(): Assignment
    {
        return $this->route('assignment');
    }

    public function authorize()
    {
        Gate::authorize('inspect', $this->assignment());
    }
}
