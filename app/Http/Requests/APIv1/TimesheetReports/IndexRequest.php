<?php

namespace App\Http\Requests\APIv1\TimesheetReports;

use App\Models\Timesheet;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class IndexRequest extends FormRequest
{
    public function timesheet(): Timesheet
    {
        return Timesheet::query()->findOrFail($this->input('timesheet_id'));
    }

    public function authorize(): bool
    {
        return Gate::allows('view', $this->timesheet());
    }

    public function rules(): array
    {
        return [
            'timesheet_id' => ['required', 'exists:timesheets,id'],
        ];
    }
}
