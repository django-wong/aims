<?php

namespace App\Http\Requests\APIv1;

use Illuminate\Foundation\Http\FormRequest;

class SignOffTimesheetRequest extends FormRequest
{
    public function rules()
    {
        return [
            'signature_base64' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'signature_base64.string' => 'The signature must be provided',
        ];
    }
}
