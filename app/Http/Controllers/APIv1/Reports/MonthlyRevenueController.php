<?php

namespace App\Http\Controllers\APIv1\Reports;

use App\Models\CurrentOrg;
use App\Models\TimesheetItem;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class MonthlyRevenueController
{
    public function __invoke(CurrentOrg $org)
    {
        $start = now()->startOfMonth()->subMonths(12);
        $end = now()->endOfMonth();

        $data = TimesheetItem::query()
            ->select([
                DB::raw("date_format(timesheet_items.date, '%Y-%m') as month"),
                DB::raw("SUM(timesheet_items.cost) as hour_cost"),
                DB::raw("SUM(timesheet_items.travel_cost) as travel_cost"),
                DB::raw("SUM((timesheet_items.hourly_rate - timesheet_items.pay_rate) * timesheet_items.hours) as hour_profit"),
                DB::raw("SUM((timesheet_items.travel_rate - timesheet_items.pay_travel_rate) * timesheet_items.travel_distance) as travel_profit")
            ])
            ->leftJoin('timesheets', 'timesheet_items.timesheet_id', '=', 'timesheets.id')
            ->leftJoin('assignments', 'timesheets.assignment_id', '=', 'assignments.id')
            ->where('date', '>=', $start)
            ->where(function (Builder $query) use ($org) {
                $query->whereRaw('assignments.org_id = ? or assignments.operation_org_id = ?', [$org->id, $org->id]);
            })
            ->groupBy('month')
            ->get();

        $results = [];

        while ($start->lessThanOrEqualTo($end)) {
            $monthKey = $start->format('Y-m');
            $monthData = $data->firstWhere('month', $monthKey);

            $results[] = [
                'month' => $monthKey,
                'hour_cost' => $monthData->hour_cost ?? 0,
                'travel_cost' => $monthData->travel_cost ?? 0,
                'hour_profit' => $monthData->hour_profit ?? 0,
                'travel_profit' => $monthData->travel_profit ?? 0,
            ];

            $start = $start->addMonth();
        }

        return response()->json($results);
    }
}
