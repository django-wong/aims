<?php

namespace App\Http\Requests\APIv1\Assignments;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Gate;

class UpdateRequest extends StoreRequest
{
    public function rules(): array
    {
        return Arr::only(parent::rules(), [
            // Assignment details (non-critical)
            'notes',
            'report_required',
            'vendor_id',
            'sub_vendor_id',
            'assignment_type_id',
            'inspector_id',
            'operation_org_id',

            // Visit fields
            'first_visit_date',
            'visit_frequency',
            'total_visits',
            'hours_per_visit',
            'visit_contact_id',

            // Scope of assignment (booleans)
            'pre_inspection_meeting',
            'final_inspection',
            'dimensional',
            'sample_inspection',
            'witness_of_tests',
            'monitoring',
            'packing',
            'document_review',
            'expediting',
            'audit',

            // Status/flash report/exit call
            'exit_call',
            'flash_report',
            'contact_details',
            'contact_email',

            // Equipment and additional notes
            'equipment',
            'special_notes',
            'inter_office_instructions',
            'inspector_instructions',

            // Reporting format fields
            'reporting_format',
            'reporting_frequency',
            'send_report_to_email',
            'timesheet_format',
            'ncr_format',
            'punch_list_format',
            'irn_format',
            'document_stamp',
        ]);
    }

    public function authorize()
    {
        return Gate::allows('update', $this->route('assignment'));
    }
}
