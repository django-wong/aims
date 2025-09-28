<?php

namespace App\Http\Requests\APIv1;

use Illuminate\Foundation\Http\FormRequest;

class ApproveInvoiceRequest extends FormRequest
{
    public function rules()
    {
        return [
            'signature_base64' => 'required|string',
        ];
    }
}
