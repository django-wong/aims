<?php

namespace App\Http\Requests\APIv1;

use App\Models\Assignment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreNotificationOfInspectionRequest extends FormRequest
{
    use HasAttachments;

    public function getAssignment(): ?Assignment
    {
        return Assignment::query()->find($this->input('assignment_id'));
    }

    public function rules(): array
    {
        return [
            'assignment_id' => 'required|exists:assignments,id',
            'from' => 'required|date',
            'to' => 'required|date|after_or_equal:from',
            'inspector_id' => [
                'nullable',
                'exists:users,id',
                function ($attribute, $value, $fail) {
                    $assignment = $this->getAssignment();
                    if ($assignment && $value) {
                        if (empty($assignment->assignment_inspectors()->where('user_id', $value)->exists())) {
                            $fail('The selected inspector is not assigned to this assignment.');
                        }
                    }
                }
            ],
            'description' => 'nullable|string',
            'location' => 'nullable|string',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|mimes:pdf,jpg,jpeg,png|max:10240'
        ];
    }

    public function authorize(): bool
    {
        return Gate::allows('request-inspection', $this->getAssignment());
    }
}
