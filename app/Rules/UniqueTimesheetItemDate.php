<?php

namespace App\Rules;

use App\Models\Timesheet;
use App\Models\TimesheetItem;
use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Eloquent\Builder;

class UniqueTimesheetItemDate implements ValidationRule
{
    public function __construct(private Timesheet $timesheet, private null|int $timesheet_item = null)
    {
        // The constructor can be used to inject dependencies if needed.
    }

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $query = TimesheetItem::query()
            ->where('timesheet_id', $this->timesheet->id)
            ->tap(function (Builder $query) {
                if ($this->timesheet_item) {
                    $query->where('id', '!=', $this->timesheet_item);
                }
            })
            ->whereDate('date', $value);

        if ($query->exists()) {
            $fail('You have already submitted a timesheet for this date.');
            return;
        }

        $start = Carbon::make($this->timesheet->start);
        $end = Carbon::make($this->timesheet->end);
        $date = Carbon::make($value);
        if (!$date || $date->isBefore($start) || $date->isAfter($end)) {
            $fail('The date must be within the timesheet period.');
        }
    }
}
