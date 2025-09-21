<?php

namespace App\Http\Requests\APIv1\Projects;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Unique;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Adjust authorization logic as needed
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'project_type_id' => 'nullable|integer|exists:project_types,id',
            'client_id' => 'nullable|integer|exists:clients,id',
            'title' => 'required|string|max:255',
            'commission_rate' => 'nullable|numeric|min:0',
            'process_fee_rate' => 'nullable|numeric|min:0'
        ];
    }

    public function messages(): array
    {
        return [
            'number' => 'The project number already taken. Try generate a new one',
        ];
    }
}
