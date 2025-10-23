<?php

namespace App\Http\Controllers;

use App\Models\InspectorSkillMatrix;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function field_operatives_manhour_summary(Request $request)
    {
        $year = $request->get('year', date('Y'));

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
            where user_roles.role = 5 and YEAR(timesheet_items.date) = ?
            group by users.id, orgs.name;
        ', [$year]);

        return inertia('reports/field-operatives-manhour-summary', [
            'year' => $year,
            'next_year' => $year + 1,
            'previous_year' => $year - 1,
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

    public function hours_entry(Request $request)
    {
        return inertia('reports/hours-entry');
    }

    public function hours_log()
    {
        return inertia('reports/hours-log');
    }

    public function man_hours(Request $request)
    {
        $year = $request->get('year', date('Y'));

        $org_id = auth()->user()->user_role->org_id;

        $data = DB::select("
            with monthly_usage as (select
                clients.business_name as client_name,
                clients.client_group as client_group,
                lower(date_format(timesheet_items.date, '%b')) as month,
                sum(timesheet_items.hours) as hours
            from timesheet_items
            left join timesheets on timesheet_items.timesheet_id = timesheets.id
            left join assignments on timesheets.assignment_id = assignments.id
            left join projects on assignments.project_id = projects.id
            left join clients on projects.client_id = clients.id
            where year(timesheet_items.date) = ? and (assignments.org_id = ? or assignments.operation_org_id = ?)
            group by clients.id, month)
            select
                client_name,
                client_group,
                JSON_OBJECTAGG(month, hours) as monthly_hours
            from monthly_usage group by client_name, client_group;
        ", [$year, $org_id, $org_id]);

        return inertia('reports/man-hours', [
            'data' => array_map(function ($item) {
                $item->monthly_hours = json_decode($item->monthly_hours, true);
                return $item;
            }, $data),
            'year' => $year,
            'next_year' => $year + 1,
            'previous_year' => $year - 1,
        ]);
    }

    public function man_hours_by_year()
    {
        return inertia('reports/man-hours-by-year');
    }

    public function man_hours_monthly_by_year()
    {
        return inertia('reports/man-hours-monthly-by-year');
    }

    public function man_hours_monthly_by_year_and_office()
    {
        return inertia('reports/man-hours-monthly-by-year-and-office');
    }

    public function invoice_required()
    {
        return inertia('reports/invoice-required');
    }

    public function reports_late()
    {
        return inertia('reports/reports-late');
    }

    public function approval_efficiency()
    {
        return inertia('reports/approval-efficiency');
    }

    public function skill_matrix()
    {
        return inertia(
            'reports/skill-matrix', [
                'locations' => InspectorSkillMatrix::query()->select('state')->distinct()->orderBy('state')->pluck('state')->filter()->values(),
            ]
        );
    }
}
