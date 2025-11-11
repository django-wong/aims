<?php

namespace App\Http\Requests\APIv1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateOrgRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'string|max:255|min:2',
            'code' => 'string|max:50|min:2',
            'timezone' => 'string|max:100|min:2',
            'abn' => 'string|nullable|min:1|max:20',
            'billing_name' => 'string|nullable|min:1|max:255',
            'billing_address' => 'string|nullable|min:1|max:1000',
            'billing_statement' => 'string|nullable|min:1|max:1000'
        ];
    }

    public function authorize()
    {
        return Gate::allows('update', $this->route('org'));
    }
}
