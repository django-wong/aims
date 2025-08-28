<?php

namespace App\Http\Controllers\APIv1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class DestroyBudgetRequest extends FormRequest
{
    public function authorize()
    {
        return Gate::authorize('delete', $this->route('budget'));
    }
}
