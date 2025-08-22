<?php

namespace App\Http\Requests\APIv1\Assignments;

use App\Models\Assignment;
use App\Models\Budget;
use App\Models\Org;
use App\Models\Project;
use App\Models\PurchaseOrder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreRequest extends FormRequest
{
    public function rules()
    {
        return [
            'project_id' => 'required|exists:projects,id',
            'purchase_order_id' => [
                'nullable',
                'exists:purchase_orders,id',
                function ($name, $value, $fail) {
                    if ($this->purchase_order()->project()->isNot($this->project())) {
                        $fail('Purchase order does not belong to the project.');
                    }
                }
            ],

            // Start from here


            'notes' => 'nullable|string|max:1000',
            'report_required' => 'nullable|boolean',
            'vendor_id' => 'nullable|exists:vendors,id',
            'sub_vendor_id' => 'nullable|exists:vendors,id',
            'assignment_type_id' => [
                'required',
                'exists:assignment_types,id',
                function($name, $value, $fail) {
                    if ($this->input('purchase_order_id')) {
                        $budget = Budget::query()
                            ->where('purchase_order_id', $this->input('purchase_order_id'))
                            ->where('assignment_type_id', $value)
                            ->first();
                        if (!$budget) {
                            $fail('Rate and budget is not available.');
                        }
                    }
                }
                ],
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
            'operation_org_id' => [
                'nullable',
                'exists:orgs,id',
                function ($name, $value, $fail) {
                    if ($value && $value == $this->user()->org->id) {
                        $fail('Can not delegate to the contract holder\'s own organization.');
                    }
                }
            ],

            // Visit fields
            'first_visit_date' => 'nullable|date',
            'visit_frequency' => 'nullable|string|max:255',
            'total_visits' => 'nullable|integer|min:1',
            'hours_per_visit' => 'nullable|integer|min:1|max:255',
            'visit_contact_id' => 'nullable|exists:contacts,id',

            // Scope of assignment (booleans)
            'pre_inspection_meeting' => 'nullable|boolean',
            'final_inspection' => 'nullable|boolean',
            'dimensional' => 'nullable|boolean',
            'sample_inspection' => 'nullable|boolean',
            'witness_of_tests' => 'nullable|boolean',
            'monitoring' => 'nullable|boolean',
            'packing' => 'nullable|boolean',
            'document_review' => 'nullable|boolean',
            'expediting' => 'nullable|boolean',
            'audit' => 'nullable|boolean',

            // Status/flash report/exit call
            'exit_call' => 'nullable|boolean',
            'flash_report' => 'nullable|boolean',
            'contact_details' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',

            // Equipment and additional notes
            'equipment' => 'nullable|string',
            'special_notes' => 'nullable|string',
            'inter_office_instructions' => 'nullable|string|max:1500',
            'inspector_instructions' => 'nullable|string|max:1500',

            // Reporting format fields
            'reporting_format' => 'nullable|integer|in:0,1',
            'reporting_frequency' => 'nullable|integer|in:0,1',
            'send_report_to_email' => 'nullable|email|max:255',
            'timesheet_format' => 'nullable|integer|in:0,1',
            'ncr_format' => 'nullable|integer|in:0,1',
            'punch_list_format' => 'nullable|integer|in:0,1',
            'irn_format' => 'nullable|integer|in:0,1',
            'document_stamp' => 'nullable|integer|in:0,1',
            //
        ];
    }

    public function authorize()
    {
        return Gate::authorize('create', [Assignment::class, Org::current()]);
    }

    public function project()
    {
        return Project::query()->find($this->input('project_id'));
    }

    public function purchase_order()
    {
        return  PurchaseOrder::query()->find(
            $this->input('purchase_order_id')
        );
    }
}
