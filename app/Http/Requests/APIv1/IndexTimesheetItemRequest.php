<?php

namespace App\Http\Requests\APIv1;

use Illuminate\Foundation\Http\FormRequest;

class IndexTimesheetItemRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'filter.timesheet_id' => 'required_without:filter.assignment_id',
            'filter.assignment_id' => 'required_without:filter.timesheet_id',
        ];
    }
}
