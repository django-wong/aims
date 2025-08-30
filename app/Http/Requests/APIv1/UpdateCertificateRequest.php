<?php

namespace App\Http\Requests\APIv1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateCertificateRequest extends FormRequest
{
    public function authorize(): \Illuminate\Auth\Access\Response
    {
        return Gate::authorize('update', $this->route('certificate'));
    }

    public function rules(): array
    {
        return [
            'certificate_type_id' => 'nullable|exists:certificate_types,id',
            'certificate_technique_id' => 'nullable|exists:certificate_techniques,id',
            'certificate_level_id' => 'nullable|exists:certificate_levels,id',
            'title' => 'required|string|max:255',
            'issued_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:issued_at',
        ];
    }
}
