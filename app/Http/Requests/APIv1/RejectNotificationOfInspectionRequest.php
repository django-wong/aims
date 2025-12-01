<?php

namespace App\Http\Requests\APIv1;

use Illuminate\Foundation\Http\FormRequest;

class RejectNotificationOfInspectionRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'rejection_reason' => 'required|string|max:1000',
            'proposed_from' => 'date',
            'proposed_to' => 'required_with:proposed_from|date|after_or_equal:proposed_from',
        ];
    }
}
