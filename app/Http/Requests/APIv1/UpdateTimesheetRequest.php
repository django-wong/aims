<?php

namespace App\Http\Requests\APIv1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTimesheetRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'late' => ['boolean'],
            'issue_code' => ['sometimes']
        ];
    }
}
