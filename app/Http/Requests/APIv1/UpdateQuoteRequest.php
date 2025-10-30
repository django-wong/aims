<?php

namespace App\Http\Requests\APIv1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateQuoteRequest extends FormRequest
{
    public function rules()
    {
        return [
            'suffix' => 'string|nullable',
            'serial_number' => 'required|string',
            'client_id' => 'nullable|integer|exists:clients,id',
            'client_ref' => 'string|nullable',
            'i_e_a' => 'string|nullable',
            'details' => 'string|max:1000|nullable',
            'controlling_org_id' => 'integer|exists:orgs,id|nullable',
            'received_date' => 'date|nullable',
            'pass_to_user' => 'string|nullable',
            'type' => 'string|nullable',
            'due_date' => 'date|nullable',
            'despatched_date' => 'date|nullable',
            'status' => 'integer|in:0,1,2,3,4',
            'notes' => 'string|nullable',
            'quote_client_id' => 'nullable|integer|exists:clients,id',
        ];
    }

    public function authorize()
    {
        return Gate::allows('update', $this->route('quote'));
    }
}
