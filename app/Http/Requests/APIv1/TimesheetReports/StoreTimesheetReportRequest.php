<?php

namespace App\Http\Requests\APIv1\TimesheetReports;

use App\Models\Timesheet;
use App\Models\TimesheetReport;
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
    public function authorize(): bool
    {
        return Gate::allows(
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
            'attachment' => ['file', 'max:10240']
        ];
    }
}
