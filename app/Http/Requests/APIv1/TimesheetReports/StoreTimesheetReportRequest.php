<?php

namespace App\Http\Requests\APIv1\TimesheetReports;

use App\Models\Timesheet;
use App\Models\TimesheetReport;
use Illuminate\Auth\Access\Response;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreTimesheetReportRequest extends FormRequest
{

    public function timesheet(): Timesheet
    {
        return Timesheet::query()->findOrFail($this->input('timesheet_id'));
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool|Response
    {
        return Gate::authorize(
            'create', [TimesheetReport::class, $this->timesheet()]
        );
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'timesheet_id' => ['required', 'exists:timesheets,id'],
            'type' => ['required', 'string'],
            'attachment' => ['file', 'max:10240', 'required'],
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
