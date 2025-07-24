<?php

namespace App\Http\Requests\Assignments;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    public function rules()
    {
        return [
            'project_id' => 'required|exists:projects,id',
            'assignment_type_id' => 'required|exists:assignment_types,id',
            'inspector_id' => 'nullable|exists:users,id',
            'vendor_id' => 'nullable|exists:vendors,id',
            'sub_vendor_id' => 'nullable|exists:vendors,id',
            'operation_org_id' => 'nullable|exists:orgs,id',
            'notes' => 'nullable|string|max:1000'
        ];
    }
}
