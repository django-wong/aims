<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        \Illuminate\Support\Facades\DB::unprepared("
            CREATE OR REPLACE VIEW late_reports AS
            select timesheets.id                as timesheet_id,
                   assignments.reference_number as reference_number,
                   assignments.id               as assignment_id,
                   assignments.org_id           as org_id,
                   assignments.operation_org_id as operation_org_id,
                   orgs.name                    as org_name,
                   operation_org.name           as operation_org_name,
                   users.name                   as inspector_name,
                   users.id                     as inspector_id,
                   assignments.report_required  as report_required,
                   timesheets.issue_code        as issue_code,
                   timesheet_items.date         as earliest_visit_date,
                   timesheet_reports.created_at as report_submitted_at,
                   timesheet_reports.report_no  as report_no,
                   clients.business_name        as client_business_name,
                   clients.id                   as client_id,
                   projects.id                  as project_id,
                   IF(skills.i_e_a = 'e', 2, 1) as target,
                   datediff(timesheet_reports.created_at, timesheet_items.date) as days_to_report
            from timesheets
                     left join assignments on timesheets.assignment_id = assignments.id
                     left join skills on assignments.skill_id = skills.id
                     left join orgs on assignments.org_id = orgs.id
                     left join orgs operation_org on assignments.operation_org_id = operation_org.id
                     left join users on timesheets.user_id = users.id
                     left join timesheet_items on timesheet_items.timesheet_id = timesheets.id and timesheet_items.id = (select min(id) from timesheet_items where timesheet_items.timesheet_id = timesheets.id order by timesheet_items.date desc limit 1)
                     left join timesheet_reports on timesheet_reports.timesheet_id = timesheets.id and timesheet_reports.type = 'inspection-report'
                     left join projects on projects.id = assignments.project_id
            left join clients on projects.client_id = clients.id
            where timesheets.late = 1;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::unprepared(
            "DROP VIEW IF EXISTS late_reports;"
        );
    }
};
