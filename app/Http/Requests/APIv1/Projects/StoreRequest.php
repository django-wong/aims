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
            'po_number' => 'nullable|string|max:255',
            'number' => [
                'string',
                Rule::unique('projects')->where(function ($query) {
                    return $query->where('org_id', auth()->user()->org->id)->where('number', $this->input('number'));
                })
            ],
            'budget' => 'nullable|numeric|min:0',
            'quote_id' => 'nullable|integer|exists:quotes,id',
            'status' => 'required|integer|in:0,1,2', // 0: Draft, 1: Open, 2: Closed

            'first_alert_threshold' => 'nullable|integer|min:0|max:100',
            'second_alert_threshold' => 'nullable|integer|min:0|max:100|gt:first_alert_threshold',
            'final_alert_threshold' => 'nullable|integer|min:0|max:100|gt:second_alert_threshold',
        ];
    }

    public function messages(): array
    {
        return [
            'number' => 'The project number already taken. Try generate a new one',
        ];
    }
}
