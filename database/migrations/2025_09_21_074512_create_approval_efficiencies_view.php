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
            CREATE OR REPLACE VIEW approval_efficiencies AS
            select clients.org_id                                                                  as org_id,
                   clients.id                                                                      as client_id,
                   clients.business_name                                                           as client_name,
                   clients.client_group                                                            as client_group_name,
                   clients.code                                                                    as client_code,
                   AVG(timestampdiff(HOUR, timesheets.approved_at, timesheets.client_approved_at)) as avg_hours,
                   MAX(timestampdiff(HOUR, timesheets.approved_at, timesheets.client_approved_at)) as max_hours,
                   MIN(timestampdiff(HOUR, timesheets.approved_at, timesheets.client_approved_at)) as min_hours,
                   COUNT(timesheets.id)                                                            as total_approval_in_last_year
            from timesheets
                     left join assignments on timesheets.assignment_id = assignments.id
                     left join projects on assignments.project_id = projects.id
                     left join clients on projects.client_id = clients.id
            where timesheets.submitted_at is not null
              and timesheets.deleted_at is null
              and timesheets.start > (now() - interval 365 day)
            group by client_id, org_id;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::unprepared("DROP VIEW IF EXISTS approval_efficiencies;");
    }
};
