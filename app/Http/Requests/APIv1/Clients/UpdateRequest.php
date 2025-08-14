<?php

namespace App\Http\Requests\APIv1\Clients;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends StoreRequest
{
    public function rules(): array
    {
        return [
            ...parent::rules(),
            'logo' => 'nullable|image|max:2048',
        ];
    }
}
