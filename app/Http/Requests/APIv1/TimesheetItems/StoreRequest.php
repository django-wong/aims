<?php

namespace App\Http\Requests\APIv1\TimesheetItems;

use App\Models\Assignment;
use App\Models\TimesheetItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::check('create', [TimesheetItem::class, $this->assignment()]);
    }

    public function assignment()
    {
        return Assignment::query()->find($this->input('assignment_id'));
    }

    public function rules(): array
    {
        return [
            'assignment_id' => 'required|exists:assignments,id',
            'date' => 'required|date',
            'work_hours' => 'required|integer|min:0',
            'travel_hours' => 'nullable|integer|min:0',
            'report_hours' => 'nullable|integer|min:0',
            'km_traveled' => 'nullable|integer|min:0',
            'days' => 'nullable|integer|min:0|max:31',
            'overnights' => 'nullable|integer|min:0|max:31',
        ];
    }
}
