<?php

namespace App\Http\Controllers\APIv1;

use App\Models\Budget;
use App\Models\PurchaseOrder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreBudgetRequest extends FormRequest
{
    public function rules()
    {
        return [
            'purchase_order_id' => 'required|exists:purchase_orders,id',
            'rate_code' => 'required|string|max:255',
            'travel_rate' => 'nullable|numeric|min:0',
            'hourly_rate' => 'nullable|numeric|min:0',
            'budgeted_mileage' => 'nullable|numeric|min:0',
            'budgeted_hours' => 'nullable|numeric|min:0',
            'budgeted_expenses' => 'nullable|numeric|min:0',
            'assignment_type_id' => 'nullable|exists:assignment_types,id',
        ];
    }

    public function authorize()
    {
        return Gate::authorize('create', [Budget::class, PurchaseOrder::query()->find($this->input('purchase_order_id'))]);
    }
}
