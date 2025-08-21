<?php

namespace App\Http\Requests\APIv1\TimesheetItems;

use App\Models\Timesheet;
use App\Rules\UniqueTimesheetItemDate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;

class UpdateRequest extends StoreRequest
{
    public function rules(): array
    {
        return Arr::only([
            ...parent::rules(),
            'date' => ['nullable','date', new UniqueTimesheetItemDate($this->timesheet(), $this->route('timesheet_item')->id)],
        ], [
            'item_number',
            'date',
            'report_hours',
            'work_hours',
            'travel_hours',
            'hourly_rate',
            'days',
            'overnights',
            'travel_distance',
            'travel_rate',
            'hotel',
            'meals',
            'rail_or_airfare',
            'other',
        ]);
    }

    public function timesheet(): Timesheet
    {
        return $this->route('timesheet_item')->timesheet;
    }
}
