<?php

namespace App\Http\Controllers\APIv1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateBudgetRequest extends FormRequest
{
    public function rules()
    {
        return [
            'assignment_type_id' => 'sometimes|nullable|exists:assignment_types,id',
            'rate_code' => 'sometimes|required|string|max:255',
            'travel_rate' => 'sometimes|nullable|numeric|min:0',
            'hourly_rate' => 'sometimes|nullable|numeric|min:0',
            'budgeted_mileage' => 'sometimes|nullable|numeric|min:0',
            'budgeted_hours' => 'sometimes|nullable|numeric|min:0',
            'budgeted_expenses' => 'sometimes|nullable|numeric|min:0',
        ];
    }

    public function authorize()
    {
        return Gate::authorize('update', $this->route('budget'));
    }
}
