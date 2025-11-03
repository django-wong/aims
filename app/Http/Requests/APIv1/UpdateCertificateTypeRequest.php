<?php

namespace App\Http\Requests\APIv1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateCertificateTypeRequest extends FormRequest
{
    public function rules()
    {
        $certificateTypeId = $this->route('certificate_type')->id;

        return [
            'name' => 'required|string|unique:certificate_types,name,' . $certificateTypeId,
        ];
    }

    public function authorize()
    {
        return Gate::allows('update', $this->route('certificate_type'));
    }
}
