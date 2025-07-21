<?php

namespace App\Http\Requests\APIv1\Clients;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'business_name' => 'required|string|max:255',
            'coordinator_id' => 'nullable|exists:users,id',
            'reviewer_id' => 'nullable|exists:users,id',
            'notes' => 'nullable|string|max:1000',
            'invoice_reminder' => 'nullable|integer|min:0|max:30',
            'address' => 'nullable|array',
            'address.country' => 'string|max:255',
            'address.state' => 'string|max:255',
            'address.city' => 'string|max:255',
            'address.zip' => 'string|max:255',
            'address.address_line_1' => 'string|max:255',
            'address.address_line_2' => 'nullable|string|max:255',
            'user' => 'nullable|array',
            'user.name' => 'required|string|max:255',
            'user.email' => 'required|email|max:255',
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function basic(): array
    {
        return $this->only(['business_name', 'coordinator_id', 'reviewer_id', 'notes', 'invoice_reminder']);
    }

}
