<?php

namespace App\Http\Requests\APIv1\Assignments;

use App\Http\Requests\APIv1\HasAttachments;
use App\Models\Assignment;
use App\Models\Budget;
use App\Models\Org;
use App\Models\Project;
use App\Models\PurchaseOrder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreRequest extends FormRequest
{
    use HasAttachments;

    public function rules(): array
    {
        return [
            'reference_number' => 'nullable|string|max:255|unique:assignments,reference_number',
            'delegated' => 'boolean',

            'previous_reference_number' => 'nullable|string|max:255',
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

            'coordinator_id' => 'nullable|exists:users,id',

            'client_po' => 'nullable|string|max:255',
            'client_po_rev' => 'nullable|string|max:255',
            'po_delivery_date' => 'nullable|date',
            'close_date' => 'nullable|date|after_or_equal:po_delivery_date',
            'final_invoice_date' => 'nullable|date|after_or_equal:close_date',
            'i_e_a' => 'nullable|string',

            'skill_id' => 'nullable',

            'notes' => 'nullable|string|max:1000',
            'report_required' => 'nullable|boolean',
            'vendor_id' => 'nullable|exists:vendors,id',
            'sub_vendor_id' => 'nullable|exists:vendors,id',

            'operation_org_id' => [
                'nullable',
                'exists:orgs,id',
                function ($name, $value, $fail) {
                    if ($value && $value == $this->user()->org->id) {
                        $fail('Can not delegate to the contract holder\'s own organization.');
                    }
                }
            ],
            'operation_coordinator_id' => 'nullable|exists:users,id',

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
            'client_contact_id' => 'nullable|exists:contacts,id',

            // Equipment and additional notes
            'equipment' => 'nullable|string',
            'special_notes' => 'nullable|string',
            'inter_office_instructions' => 'nullable|string|max:1500',
            'inspector_instructions' => 'nullable|string|max:1500',

            // Reporting format fields
            'reporting_format' => 'nullable|integer|in:0,1',
            'reporting_frequency' => 'nullable|integer|in:0,1',
            'send_report_to' => 'nullable|numeric|in:0,1,2',
            'timesheet_format' => 'nullable|integer|in:0,1',
            'ncr_format' => 'nullable|integer|in:0,1',
            'punch_list_format' => 'nullable|integer|in:0,1',
            'irn_format' => 'nullable|integer|in:0,1',
            'document_stamp' => 'nullable|integer|in:0,1',
            'issue_irn_to_vendor' => 'nullable|integer|in:0,1',
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
