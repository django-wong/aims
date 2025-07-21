<?php

namespace App\Http\Requests\APIv1\Projects;

use Illuminate\Foundation\Http\FormRequest;

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
            'budget' => 'nullable|numeric|min:0',
            'quote_id' => 'nullable|integer|exists:quotes,id',
            'status' => 'required|integer|in:0,1,2', // 0: Draft, 1: Open, 2: Closed
        ];
    }
}
