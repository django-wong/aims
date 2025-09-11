<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        \Illuminate\Support\Facades\DB::unprepared("
            CREATE OR REPLACE VIEW man_hours_by_years AS
            with hours_by_year as (select clients.id                                as client_id,
                                          clients.client_group,
                                          clients.business_name,
                                          date_format(timesheet_items.date, 'y_%Y') as year,
                                          sum(timesheet_items.hours)                as hours
                                   from assignments
                                            left join timesheets on timesheets.assignment_id = assignments.id
                                            left join projects on projects.id = assignments.project_id
                                            left join clients on clients.id = projects.client_id
                                            left join timesheet_items on timesheets.id = timesheet_items.timesheet_id
                                   where timesheet_items.id is not null
                                   group by year, clients.id)
            select client_id, client_group, business_name, json_objectagg(year, hours) as hours, sum(hours) as total_hours
            from hours_by_year
            group by client_id;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::unprepared("DROP VIEW IF EXISTS man_hours_by_years");
    }
};
