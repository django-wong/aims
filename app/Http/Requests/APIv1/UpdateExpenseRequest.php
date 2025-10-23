<?php

namespace App\Http\Requests\APIv1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateExpenseRequest extends FormRequest
{
    use HasAttachments;

    public function rules(): array
    {
        return [
            'net_amount' => 'required|numeric|min:0',
            'gst' => 'numeric|nullable|min:0',
            'process_fee' => 'numeric|nullable|min:0',
            'type' => 'required|string|in:travel,meals,accommodation,other',
            'invoice_number' => 'string|nullable',
            'creditor' => 'required|string',
            'description' => 'string|nullable',
            'report_number' => 'string|nullable',
        ];
    }

    public function authorize(): bool
    {
        return Gate::allows('update', $this->route('expense'));
    }
}
