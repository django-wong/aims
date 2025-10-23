<?php

namespace App\Http\Requests\APIv1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class DestroyExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('delete', $this->route('expense'));
    }
}
