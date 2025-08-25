<?php

namespace App\Http\Requests\APIv1\TimesheetReports;

use App\Models\Timesheet;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateTimesheetReportRequest extends FormRequest
{
    public function timesheet(): Timesheet
    {
        return $this->route('timesheetReport')->timesheet;
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::allows('inspect', $this->timesheet()->assignment);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'attachment' => ['file', 'max:10240']
        ];
    }
}
