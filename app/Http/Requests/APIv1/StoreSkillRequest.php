<?php

namespace App\Http\Requests\APIv1;

use App\Models\Skill;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreSkillRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        return Gate::authorize('create', Skill::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'code' => 'required|string|unique:skills,code',
            'report_code' => 'nullable|string',
            'i_e_a' => 'required|string',
            'description' => 'nullable|string',
            'sort' => 'nullable|numeric:'
        ];
    }
}
