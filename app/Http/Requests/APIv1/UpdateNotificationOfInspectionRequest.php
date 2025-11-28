<?php

namespace App\Http\Requests\APIv1;

use App\Models\Assignment;

class UpdateNotificationOfInspectionRequest extends StoreNotificationOfInspectionRequest
{
    public function rules(): array
    {
        return parent::rules() + [
            // 'proposed_from' => 'nullable|datetime|required_with:proposed_to',
            // 'proposed_to' => 'nullable|datetime|after_or_equal:proposed_from|required_with:proposed_from',
            // 'rejection_reason' => 'nullable|string'
        ];
    }

    public function getAssignment(): ?Assignment
    {
        return once(fn () => $this->route('notification_of_inspection')->assignment);
    }
}
