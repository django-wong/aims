<?php

namespace App\Http\Requests\APIv1;

use Illuminate\Foundation\Http\FormRequest;

class ApproveTimesheetRequest extends FormRequest
{
    public function rules()
    {
        return [
            'signature_base64' => 'required|string',
        ];
    }

    public function messages()
    {
        return [
            'signature_base64' => 'Signature is required.',
        ];
    }
}
