<?php

namespace App\Http\Requests\APIv1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateQuoteRequest extends FormRequest
{
    public function rules()
    {
        return [
            'suffix' => 'string',
            'serial_number' => 'required|string',
            'client_id' => 'required|integer|exists:clients,id',
            'client_ref' => 'string',
            'i_e_a' => 'string',
            'details' => 'string|max:1000',
            'controlling_org_id' => 'integer|exists:orgs,id',
            'received_date' => 'date',
            'pass_to_user' => 'string',
            'type' => 'string',
            'due_date' => 'date',
            'despatched_date' => 'date',
            'status' => 'integer|in:0,1,2,3,4',
            'notes' => 'string',
            'quote_client_id' => 'integer|exists:clients,id',
        ];
    }

    public function authorize()
    {
        return Gate::allows('update', $this->route('quote'));
    }
}
