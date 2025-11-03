<?php

namespace App\Http\Requests\APIv1;

use App\Models\CertificateType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreCertificateTypeRequest extends FormRequest
{
    public function rules()
    {
        return [
            'name' => 'required|string|unique:certificate_types,name',
        ];
    }

    public function authorize()
    {
        return Gate::authorize('create', CertificateType::class);
    }
}
