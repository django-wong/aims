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
            CREATE OR REPLACE VIEW timesheet_item_expense_by_types AS
            select timesheet_item_id            AS timesheet_item_id,
                   json_objectagg(type, amount) AS expenses_by_type,
                   coalesce(sum(amount), 0)     AS total
            from (select timesheet_item_id, sum(amount) as amount, type from expenses group by timesheet_item_id, type) sub
            group by sub.timesheet_item_id
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::unprepared("DROP VIEW IF EXISTS timesheet_item_expense_by_types");
    }
};
