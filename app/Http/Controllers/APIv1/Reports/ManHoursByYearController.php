<?php

namespace App\Http\Controllers\APIv1\Reports;

use App\Http\Controllers\APIv1\Controller;
use App\Models\Assignment;
use App\Models\ManHoursByYear;
use Illuminate\Support\Facades\DB;

class ManHoursByYearController extends Controller
{
    public function __invoke()
    {
        return ManHoursByYear::query()->selectRaw("client_id, client_group, business_name, json_objectagg(year, hours) as hours, sum(hours) as total_hours")
            ->from(
                DB::query()
                    ->selectRaw("clients.id as client_id, clients.client_group, clients.business_name, date_format(timesheet_items.date, 'y_%Y') as year, sum(timesheet_items.hours) as hours")
                    ->fromRaw("
                        assignments
                        left join timesheets on timesheets.assignment_id = assignments.id
                        left join projects on projects.id = assignments.project_id
                        left join clients on clients.id = projects.client_id
                        left join timesheet_items on timesheets.id = timesheet_items.timesheet_id
                    ")
                    ->where("timesheet_items.id", "<>", null)
                    ->where(function ($query) {
                        $org_id = auth()->user()->user_role->org_id;
                        $query->where("assignments.org_id", $org_id)->orWhere("assignments.operation_org_id", $org_id);
                    })
                    ->groupBy("year", "client_id"),
                "subquery"
            )
            ->groupBy("client_id")
            ->paginate();
    }
}
