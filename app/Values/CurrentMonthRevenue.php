<?php

namespace App\Values;

use App\Models\TimesheetItem;
use Carbon\Carbon;
use Illuminate\Database\Query\Builder;

class CurrentMonthRevenue extends Value
{
    public function getStart(): Carbon
    {
        return Carbon::now()->startOfMonth();
    }

    public function getEnd(): Carbon
    {
        return Carbon::now()->endOfMonth();
    }

    public function value()
    {
        $user = auth()->user();

        if (empty($user)) {
            return 0;
        }

        $result = TimesheetItem::query()
            ->whereIn('timesheet_id', function (Builder $query) use ($user) {
                $query->select('id')
                    ->from('timesheets')
                    ->whereIn('timesheets.assignment_id', function (Builder $query) use ($user) {
                        $query->select('id')
                            ->from('assignments')
                            ->where('org_id', $user->user_role->org_id);
                    });
            })
            ->whereBetween('date', [$this->getStart(), $this->getEnd()])
            ->selectRaw('SUM(cost + travel_cost) - SUM(hour_fee + travel_fee) as diff')->first();

        return $result->diff ?? 0;
    }
}
