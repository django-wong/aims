<?php

namespace App\Http\Requests\APIv1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateInvoiceRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['nullable', 'string', 'max:255'],
            'sub_title' => ['nullable', 'string', 'max:255'],
            'billing_name' => ['nullable', 'string'],
            'billing_address' => ['nullable', 'string'],
            'notes' => ['nullable', 'string']
        ];
    }

    public function authorize(): bool
    {
        return Gate::allows('update', $this->route('invoice'));
    }
}
