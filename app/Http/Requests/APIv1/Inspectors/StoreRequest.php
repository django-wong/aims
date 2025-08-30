<?php

namespace App\Http\Requests\APIv1\Inspectors;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    public function rules()
    {
        return [
            'password' => ['required', 'string', 'min:8', 'max:255', 'confirmed'],

            'title' => ['string', 'max:255'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],

            'inspector_profile' => ['array', 'nullable'],
            'inspector_profile.initials' => ['string', 'max:10', 'nullable'],
            'inspector_profile.hourly_rate' => ['numeric', 'min:0', 'nullable'],
            'inspector_profile.travel_rate' => ['numeric', 'min:0', 'nullable'],
            'inspector_profile.new_hourly_rate' => ['numeric', 'min:0', 'nullable'],
            'inspector_profile.new_travel_rate' => ['numeric', 'min:0', 'nullable'],
            'inspector_profile.new_rate_effective_date' => ['date', 'nullable'],
            'inspector_profile.assigned_identifier' => ['string', 'max:255', 'nullable'],
            'inspector_profile.include_on_skills_matrix' => ['boolean', 'nullable'],
            'inspector_profile.notes' => ['string', 'nullable'],

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

    public function messages()
    {
        return [
            'password.required' => 'Password is required when setup the inspector account.',
        ];
    }
}
