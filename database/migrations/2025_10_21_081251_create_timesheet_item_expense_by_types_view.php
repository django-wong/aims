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
            SELECT
                timesheet_item_id,
                JSON_OBJECTAGG(expenses.type, expenses.amount) as expenses_by_type
            FROM
                expenses
            group by timesheet_item_id
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
