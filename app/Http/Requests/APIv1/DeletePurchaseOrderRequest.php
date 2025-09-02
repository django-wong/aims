<?php

namespace App\Http\Requests\APIv1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class DeletePurchaseOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('delete', $this->route('purchase_order'));
    }
}
