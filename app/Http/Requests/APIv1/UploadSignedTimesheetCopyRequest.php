<?php

namespace App\Http\Requests\APIv1;

use Illuminate\Foundation\Http\FormRequest;

class UploadSignedTimesheetCopyRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'attachment' => 'required|file|mimes:pdf,png,jpg|max:51200', // Max size 50MB
        ];
    }
}
