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
            CREATE OR REPLACE VIEW man_hours_monthly_by_years AS
            select projects.client_id                             as client_id,
                   clients.org_id                                 as org_id,
                   clients.business_name                          as client_business_name,
                   clients.client_group                           as client_group,
                   clients.code                                   as client_code,
                   DATE_FORMAT(timesheet_items.date, '%Y')        as year,
                   LOWER(DATE_FORMAT(timesheet_items.date, '%b')) as month,
                   SUM(timesheet_items.hours)                     as hours
            from assignments
                   join projects on assignments.project_id = projects.id
                   join clients on projects.client_id = clients.id
                   join timesheets on assignments.id = timesheets.assignment_id
                   join timesheet_items on timesheets.id = timesheet_items.timesheet_id and timesheet_items.deleted_at is null
            group by client_id, month, year;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::unprepared("DROP VIEW IF EXISTS man_hours_monthly_by_years");
    }
};
