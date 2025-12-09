<?php

namespace App\Http\Requests\APIv1\Inspectors;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    public function rules()
    {
        return [
            'for_user_id' => ['nullable', 'exists:users,id'],

            'user' => ['array', 'nullable'],
            'user.password' => ['required_without:for_user_id', 'string', 'min:8', 'max:255', 'confirmed'],
            'user.title' => ['string', 'max:255', 'nullable'],
            'user.first_name' => ['required_without:for_user_id', 'string', 'max:255'],
            'user.last_name' => ['required_without:for_user_id', 'string', 'max:255'],
            'user.email' => ['required_without:for_user_id', 'string', 'email', 'max:255', 'unique:users,email'],

            'initials' => ['string', 'max:10', 'nullable'],
            'hourly_rate' => ['numeric', 'min:0', 'nullable'],
            'travel_rate' => ['numeric', 'min:0', 'nullable'],
            'new_hourly_rate' => ['numeric', 'min:0', 'nullable'],
            'new_travel_rate' => ['numeric', 'min:0', 'nullable'],
            'new_rate_effective_date' => ['date', 'nullable'],
            'assigned_identifier' => ['string', 'max:255', 'nullable'],
            'include_on_skills_matrix' => ['boolean', 'nullable'],
            'notes' => ['string', 'nullable'],

            'address' => 'nullable|array',
            'address.country' => 'string|max:255',
            'address.state' => 'string|max:255',
            'address.city' => 'string|max:255',
            'address.zip' => 'string|max:255',
            'address.address_line_1' => 'string|max:255',
            'address.address_line_2' => 'nullable|string|max:255',
            'address.address_line_3' => 'nullable|string|max:255',
        ];
    }

    public function basic()
    {
        return $this->only([
            'title',
            'first_name',
            'last_name',
            'email',
            'password',
        ]);
    }

    public function messages()
    {
        return [
            'password.required' => 'Password is required when setup the inspector account.',
        ];
    }
}
