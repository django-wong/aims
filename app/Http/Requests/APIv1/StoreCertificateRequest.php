<?php

namespace App\Http\Requests\APIv1;

use App\Models\Certificate;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreCertificateRequest extends FormRequest
{
    public function authorize()
    {
        return Gate::authorize('create', [Certificate::class, User::query()->find($this->input('user_id'))]);
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id',

            'certificate_type_id' => 'nullable|exists:certificate_types,id',
            'certificate_technique_id' => 'nullable|exists:certificate_techniques,id',
            'certificate_level_id' => 'nullable|exists:certificate_levels,id',
            'issued_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:issued_at',
        ];
    }
}
