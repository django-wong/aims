<?php

namespace App\Http\Requests\APIv1\TimesheetItems;

use App\Http\Requests\APIv1\HasAttachments;
use App\Models\Assignment;
use App\Models\Timesheet;
use App\Models\TimesheetItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use PhpParser\Node\Expr\Assign;

class StoreRequest extends FormRequest
{
    use HasAttachments;

    protected Assignment $assignment;

    public function authorize(): bool
    {
        return Gate::check('create', [TimesheetItem::class, $this->assignment()]);
    }

    public function assignment(): Assignment
    {
        if (empty($this->assignment)) {
            $this->assignment = Assignment::query()->find($this->input('assignment_id'));
        }
        return $this->assignment;
    }

    public function rules(): array
    {
        return [
            'assignment_id' => 'required|exists:assignments,id',
            'item_number' => 'nullable|string|max:255',
            'date' => ['nullable','date', function ($attribute, $value, $fail) {
                $exists = TimesheetItem::query()
                    ->whereIn(
                        'timesheet_id', Timesheet::query()
                            ->where('assignment_id', $this->input('assignment_id'))
                            ->select('id')
                    )
                    ->where('user_id', auth()->id())
                    ->whereDate('date', $value)
                    ->exists();
                if ($exists) {
                    $fail('You have already submitted a timesheet for this date.');
                }
            }],
            'report_hours' => 'nullable|integer|min:0',
            'work_hours' => 'nullable|integer|min:0',
            'travel_hours' => 'nullable|integer|min:0',
            'hourly_rate' => 'nullable|numeric|min:0',
            'days' => 'nullable|integer|min:0',
            'overnights' => 'nullable|integer|min:0',
            'travel_distance' => 'nullable|integer|min:0',
            'travel_rate' => 'nullable|integer|min:0',
            'hotel' => 'nullable|numeric|min:0',
            'meals' => 'nullable|numeric|min:0',
            'rail_or_airfare' => 'nullable|numeric|min:0',
            'other' => 'nullable|numeric|min:0',
        ];
    }
}
