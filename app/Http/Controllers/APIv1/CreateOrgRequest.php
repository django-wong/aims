<?php

namespace App\Http\Controllers\APIv1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class CreateOrgRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', \App\Models\Org::class);
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:orgs,name',
            'code' => 'required|string|max:50|unique:orgs,code',
            'timezone' => 'required|string|max:255',

            'address' => 'nullable|array',
            'address.country' => 'string|max:255',
            'address.state' => 'string|max:255',
            'address.city' => 'string|max:255',
            'address.zip' => 'string|max:255',
            'address.address_line_1' => 'string|max:255',
            'address.address_line_2' => 'nullable|string|max:255',
            'address.address_line_3' => 'nullable|string|max:255',

            'admin' => 'nullable|array',
            'admin.first_name' => 'required|string|max:255',
            'admin.last_name' => 'required|string|max:255',
            'admin.email' => 'required|email|max:255|unique:users,email',
            'admin.password' => 'required|string|min:8|max:255|confirmed',
        ];
    }
}
