<?php

namespace App\Http\Requests\APIv1\Assignments;

use App\Models\Budget;
use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    public function rules()
    {
        return [
            'project_id' => 'required|exists:projects,id',
            'purchase_order_id' => 'nullable|exists:purchase_orders,id',
            'assignment_type_id' => ['required', 'exists:assignment_types,id', function($name, $value, $fail) {
                if ($this->input('purchase_order_id')) {
                    $budget = Budget::query()
                        ->where('purchase_order_id', $this->input('purchase_order_id'))
                        ->where('assignment_type_id', $value)
                        ->first();
                    if (!$budget) {
                        $fail('Rate and budget is not available.');
                    }
                }
            }],
            'inspector_id' => [
                'nullable',
                'exists:users,id',
                function ($attribute, $value, $fail) {
                    if ($this->input('operation_org_id')) {
                        if ($this->input('operation_org_id') != $this->user()->org->id) {
                            $fail('You should leave the inspector empty if you wish to delegate the assignment to other office.');
                        }
                    }
                },
            ],
            'vendor_id' => 'nullable|exists:vendors,id',
            'sub_vendor_id' => 'nullable|exists:vendors,id',
            'operation_org_id' => ['nullable','exists:orgs,id', function ($name, $value, $fail) {
                if ($value && $value == $this->user()->org->id) {
                    $fail('Can not delegate to the contract holder\'s own organization.');
                }
            }],
            'notes' => 'nullable|string|max:1000',
            'report_required' => 'nullable|boolean',
        ];
    }
}
