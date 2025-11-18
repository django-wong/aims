<?php

namespace App\Http\Requests\APIv1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateSkillRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        return Gate::authorize('update', $this->route('skill'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'code' => 'required|string|unique:skills,code,' . $this->route('skill')->id,
            'report_code' => 'nullable|string',
            'i_e_a' => 'required|string',
            'description' => 'nullable|string',
            'sort' => 'nullable|numeric:',
            'on_skill_matrix' => 'array|nullable'
        ];
    }
}
