<?php

namespace App\Http\Requests\APIv1\Clients;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends StoreRequest
{
    public function rules(): array
    {
        return [
            ...parent::rules(),
            'business_name' => 'string|max:255',
            'logo' => 'nullable|image|max:2048',
            'user.name' => 'string|max:255',
            'user.email' => 'email|max:255',
            'user.password' => ['nullable', 'confirmed', 'sometimes', \Illuminate\Validation\Rules\Password::defaults()],
        ];
    }
}
