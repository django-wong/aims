<?php

namespace App\Http\Requests\APIv1\PurchaseOrders;

use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'previous_title' => 'nullable|string|max:255',
            'project_id' => 'required|exists:projects,id',
            'quote_id' => 'nullable|exists:quotes,id',

            // 'budget' => 'required|numeric|min:0|max:999999999999.99',

            'currency' => 'nullable|string|size:3',
            'travel_unit' => 'nullable|string|in:km,miles',

            'first_alert_threshold' => [
                'nullable',
                'integer',
                'min:1',
                'max:100',
                'lt:second_alert_threshold'
            ],
            'second_alert_threshold' => [
                'nullable',
                'integer',
                'min:1',
                'max:100',
                'gt:first_alert_threshold',
                'lt:final_alert_threshold'
            ],
            'final_alert_threshold' => [
                'nullable',
                'integer',
                'min:1',
                'max:100',
                'gt:second_alert_threshold'
            ],
        ];
    }

    /**
     * Get custom validation messages for the request.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Purchase order title is required.',
            'project_id.required' => 'Project is required.',
            'budget.required' => 'Budget is required.',
            'budget.numeric' => 'Budget must be a valid number.',
            'budget.min' => 'Budget must be positive.',
            'hourly_rate.required' => 'Hourly rate is required.',
            'hourly_rate.numeric' => 'Hourly rate must be a valid number.',
            'hourly_rate.min' => 'Hourly rate must be positive.',
            'first_alert_threshold.integer' => 'First alert threshold must be a whole number.',
            'first_alert_threshold.min' => 'First alert threshold must be at least 1%.',
            'first_alert_threshold.max' => 'First alert threshold cannot exceed 100%.',
            'first_alert_threshold.lt' => 'First alert threshold must be less than second alert threshold.',
            'second_alert_threshold.integer' => 'Second alert threshold must be a whole number.',
            'second_alert_threshold.min' => 'Second alert threshold must be at least 1%.',
            'second_alert_threshold.max' => 'Second alert threshold cannot exceed 100%.',
            'second_alert_threshold.gt' => 'Second alert threshold must be greater than first alert threshold.',
            'second_alert_threshold.lt' => 'Second alert threshold must be less than final alert threshold.',
            'final_alert_threshold.integer' => 'Final alert threshold must be a whole number.',
            'final_alert_threshold.min' => 'Final alert threshold must be at least 1%.',
            'final_alert_threshold.max' => 'Final alert threshold cannot exceed 100%.',
            'final_alert_threshold.gt' => 'Final alert threshold must be greater than second alert threshold.',
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        return Gate::authorize('create', [\App\Models\PurchaseOrder::class, Project::query()->find($this->input('project_id'))]);
    }

    /**
     * Get the basic purchase order data for creation.
     */
    public function basic(): array
    {
        return $this->only([
            'project_id',
            'title',
            'previous_title',
            'quote_id',
            'budget',
            // 'hourly_rate',
            'currency',
            'travel_unit',
            'first_alert_threshold',
            'second_alert_threshold',
            'final_alert_threshold'
        ]);
    }

    // /**
    //  * Prepare the data for validation.
    //  */
    // protected function prepareForValidation(): void
    // {
    //     $this->merge([
    //         'first_alert_threshold' => $this->first_alert_threshold ?? 70,
    //         'second_alert_threshold' => $this->second_alert_threshold ?? 90,
    //         'final_alert_threshold' => $this->final_alert_threshold ?? 100,
    //     ]);
    // }
}
