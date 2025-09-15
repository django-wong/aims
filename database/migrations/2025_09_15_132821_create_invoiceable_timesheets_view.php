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
            CREATE OR REPLACE VIEW invoiceable_timesheets AS
            select timesheets.id                 as timesheet_id,
                   assignments.id                as assignment_id,
                   assignments.delegated         as delegated,
                   timesheets.client_approved_at as client_approved_at
            from timesheets
            left join app.assignments on timesheets.assignment_id = assignments.id
            where deleted_at is null and ((contractor_invoice_id is null and assignments.delegated = 1) or client_invoice_id is null) and client_approved_at is not null;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::unprepared("DROP VIEW IF EXISTS invoiceable_timesheets;");
    }
};
