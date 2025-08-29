<?php

namespace App\Http\Requests\APIv1\TimesheetReports;

use App\Models\Timesheet;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateTimesheetReportRequest extends FormRequest
{
    public function timesheet(): Timesheet
    {
        return $this->route('timesheet_report')->timesheet;
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::allows('update', $this->timesheet());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'attachment' => ['file', 'max:10240'],
            'doc_no' => ['nullable', 'string'],
            'rev' => ['nullable', 'string'],
            'visit_date' => ['nullable', 'date'],
            'report_no' => ['nullable', 'string'],
            'vendor_id' => ['nullable', 'exists:vendors,id'],
            'raised_by' => ['nullable', 'string'],
            'rev_date' => ['nullable', 'date'],
            'is_closed' => ['nullable', 'boolean'],
        ];
    }
}
