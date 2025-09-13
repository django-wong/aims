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
            CREATE OR REPLACE VIEW client_timesheet_reminders AS
            select timesheets.id as timesheet_id,
                   clients.id    as client_id
            from timesheets
                     left join assignments on timesheets.assignment_id = assignments.id
                     left join projects on assignments.project_id = projects.id
                     left join clients on projects.client_id = clients.id
            where timesheets.status = 2
              and timesheets.deleted_at is null
              and assignments.close_date is not null
              and timesheets.approved_at is not null
              and timesheets.client_reminder_sent_at is null
              and TIMESTAMPDIFF(DAY, timesheets.approved_at, now()) >= 2;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP VIEW IF EXISTS client_timesheet_reminders;");
    }
};
