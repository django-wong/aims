<?php

namespace App\Http\Requests\APIv1;

use App\Http\Requests\APIv1\PurchaseOrders\StoreRequest;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdatePurchaseOrderRequest extends StoreRequest
{
    public function authorize(): \Illuminate\Auth\Access\Response|bool
    {
        return Gate::allows('update', $this->route('purchase_order'));
    }
}
