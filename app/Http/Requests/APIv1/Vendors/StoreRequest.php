<?php

namespace App\Http\Requests\APIv1\Vendors;

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
            'name' => 'required|string|max:255',
            'business_name' => 'required|max:255',
            'notes' => 'nullable|string|max:1000',
        ];
    }
}
