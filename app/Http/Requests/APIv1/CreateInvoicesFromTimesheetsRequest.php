<?php

namespace App\Http\Requests\APIv1;

use Illuminate\Foundation\Http\FormRequest;

class CreateInvoicesFromTimesheetsRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'timesheets' => ['required', 'array', 'min:1'],
        ];
    }

    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Invoice::class);
    }
}
