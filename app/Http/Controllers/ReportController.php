<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function field_operatives_manhour_summary()
    {
        $result = DB::select('
            select
                users.name,
                orgs.name as org_name,
                IFNULL(sum(timesheet_items.hours), 0) as total_hours,
                COALESCE(SUM(CASE WHEN MONTH(timesheet_items.date) = 1 THEN timesheet_items.hours ELSE 0 END), 0) AS jan_hours,
                COALESCE(SUM(CASE WHEN MONTH(timesheet_items.date) = 2 THEN timesheet_items.hours ELSE 0 END), 0) AS feb_hours,
                COALESCE(SUM(CASE WHEN MONTH(timesheet_items.date) = 3 THEN timesheet_items.hours ELSE 0 END), 0) AS mar_hours,
                COALESCE(SUM(CASE WHEN MONTH(timesheet_items.date) = 4 THEN timesheet_items.hours ELSE 0 END), 0) AS apr_hours,
                COALESCE(SUM(CASE WHEN MONTH(timesheet_items.date) = 5 THEN timesheet_items.hours ELSE 0 END), 0) AS may_hours,
                COALESCE(SUM(CASE WHEN MONTH(timesheet_items.date) = 6 THEN timesheet_items.hours ELSE 0 END), 0) AS jun_hours,
                COALESCE(SUM(CASE WHEN MONTH(timesheet_items.date) = 7 THEN timesheet_items.hours ELSE 0 END), 0) AS jul_hours,
                COALESCE(SUM(CASE WHEN MONTH(timesheet_items.date) = 8 THEN timesheet_items.hours ELSE 0 END), 0) AS aug_hours,
                COALESCE(SUM(CASE WHEN MONTH(timesheet_items.date) = 9 THEN timesheet_items.hours ELSE 0 END), 0) AS sep_hours,
                COALESCE(SUM(CASE WHEN MONTH(timesheet_items.date) = 10 THEN timesheet_items.hours ELSE 0 END), 0) AS oct_hours,
                COALESCE(SUM(CASE WHEN MONTH(timesheet_items.date) = 11 THEN timesheet_items.hours ELSE 0 END), 0) AS nov_hours,
                COALESCE(SUM(CASE WHEN MONTH(timesheet_items.date) = 12 THEN timesheet_items.hours ELSE 0 END), 0) AS dec_hours
            from users
                left join user_roles on users.id = user_roles.user_id
                left join orgs on user_roles.org_id = orgs.id
                left join timesheet_items on timesheet_items.user_id = users.id
            where user_roles.role = 5 and YEAR(timesheet_items.date) = 2025
            group by users.id, orgs.name;
        ');

        return inertia('reports/general', [
            'data' => $result,
            'title' => 'Field Operatives Manhour Summary',
            'columns' => [
                [
                    'header' => 'Inspector',
                    'accessorKey' => 'name'
                ],
                [
                    'header' => 'Office',
                    'accessorKey' => 'org_name'
                ],
                [
                    'header' => 'Total Hours',
                    'accessorKey' => 'total_hours'
                ],
                [
                    'header' => 'Jan',
                    'accessorKey' => 'jan_hours'
                ],
                [
                    'header' => 'Feb',
                    'accessorKey' => 'feb_hours'
                ],
                [
                    'header' => 'Mar',
                    'accessorKey' => 'mar_hours'
                ],
                [
                    'header' => 'Apr',
                    'accessorKey' => 'apr_hours'
                ],
                [
                    'header' => 'May',
                    'accessorKey' => 'may_hours'
                ],
                [
                    'header' => 'Jun',
                    'accessorKey' => 'jun_hours'
                ],
                [
                    'header' => 'Jul',
                    'accessorKey' => 'jul_hours'
                ],
                [
                    'header' => 'Aug',
                    'accessorKey' => 'aug_hours'
                ],
                [
                    'header' => 'Sep',
                    'accessorKey' => 'sep_hours'
                ],
                [
                    'header' => 'Oct',
                    'accessorKey' => 'oct_hours'
                ],
                [
                    'header' => 'Nov',
                    'accessorKey' => 'nov_hours'
                ],
                [
                    'header' => 'Dec',
                    'accessorKey' => 'dec_hours'
                ]
            ]
        ]);
    }
}
