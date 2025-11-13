<?php

namespace App\Http\Requests\APIv1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateOrgRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'address' => 'nullable|array',
            'address.country' => 'string|max:255',
            'address.state' => 'string|max:255',
            'address.city' => 'string|max:255',
            'address.zip' => 'string|max:255',
            'address.address_line_1' => 'string|max:255',
            'address.address_line_2' => 'nullable|string|max:255',
            'address.address_line_3' => 'nullable|string|max:255',

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
