<?php

namespace App\Http\Requests\APIv1\Budgets;

use App\Models\PurchaseOrder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class IndexRequest extends FormRequest
{
    public function authorize()
    {
        return Gate::allows('view', $this->purchase_order());
    }

    public function rules()
    {
        return [
            'purchase_order_id' => 'integer|exists:purchase_orders,id',
        ];
    }

    public function purchase_order()
    {
        return PurchaseOrder::query()->find($this->input('purchase_order_id'));
    }
}
