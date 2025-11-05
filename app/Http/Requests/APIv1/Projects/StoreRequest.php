<?php

namespace App\Http\Requests\APIv1\Projects;

use App\Models\Client;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
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
            'client_id' => [
                'nullable',
                'integer',
                'exists:clients,id',
                function ($attribute, $value, $fail) {
                    $client = Client::query()->find($value);
                    if (Gate::denies('update', $client)) {
                        $fail('No permission to assign this client to the project.');
                    }
                },
            ],
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
