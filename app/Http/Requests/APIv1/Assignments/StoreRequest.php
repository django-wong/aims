<?php

namespace App\Http\Requests\APIv1\Assignments;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    public function rules()
    {
        return [
            'project_id' => 'required|exists:projects,id',
            'assignment_type_id' => 'required|exists:assignment_types,id',
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
            'operation_org_id' => 'nullable|exists:orgs,id',
            'notes' => 'nullable|string|max:1000',
            'report_required' => 'nullable|boolean',
        ];
    }
}
