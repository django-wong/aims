<?php

namespace App\Http\Requests\APIv1\TimesheetItems;

use App\Http\Requests\APIv1\HasAttachments;
use App\Models\Assignment;
use App\Models\Timesheet;
use App\Models\TimesheetItem;
use App\Rules\UniqueTimesheetItemDate;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;

class StoreRequest extends FormRequest
{
    use HasAttachments;

    private Timesheet $timesheet;
    private Assignment $assignment;

    public function authorize(): bool
    {
        return Gate::check('create', [TimesheetItem::class, $this->assignment()]);
    }

    public function assignment(): Assignment
    {
        if (empty($this->assignment)) {
            $this->assignment = $this->timesheet()->assignment;
        }
        return $this->assignment;
    }

    public function timesheet(): Timesheet
    {
        if (empty($this->timesheet)) {
            $this->timesheet = Timesheet::query()->findOrFail($this->input('timesheet_id'));
        }
        return $this->timesheet;
    }

    public function rules(): array
    {
        return [
            'timesheet_id' => 'required|exists:timesheets,id',
            'item_number' => 'nullable|string|max:255',

            'date' => [
                'date', new UniqueTimesheetItemDate($this->timesheet()), 'required_without:dates'
            ],

            'dates' => [
                'required_without:date'
            ],

            'report_hours' => 'nullable|integer|min:0',
            'work_hours' => 'nullable|integer|min:0',
            'travel_hours' => 'nullable|integer|min:0',
            'days' => 'nullable|integer|min:0',
            'overnights' => 'nullable|integer|min:0',
            'travel_distance' => 'nullable|integer|min:0',
            'hotel' => 'nullable|numeric|min:0',
            'meals' => 'nullable|numeric|min:0',
            'rail_or_airfare' => 'nullable|numeric|min:0',
            'other' => 'nullable|numeric|min:0',
            'on_behalf_of_user_id' => 'nullable|exists:users,id',
        ];
    }
}
