<?php

namespace App\Http\Requests\APIv1;

use App\Http\Requests\APIv1\Inspectors\StoreRequest;

class UpdateInspectorRequest extends StoreRequest
{
    public function rules()
    {
        return [
            ...parent::rules(),
            'user.password' => ['sometimes', 'nullable', 'string', 'min:8', 'max:255', 'confirmed'],
            'user.email' => [
                'sometimes',
                'string',
                'email',
                'max:255',
                'unique:users,email,' . $this->route('inspector_profile')->user_id
            ],
        ];
    }
}
