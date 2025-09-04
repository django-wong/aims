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
        DB::statement("
            CREATE OR REPLACE VIEW purchase_order_monthly_usages AS
            SELECT
                purchase_orders.id AS purchase_order_id,
                DATE_FORMAT(timesheet_items.date, '%Y-%m') AS month,
                SUM(timesheet_items.hours) AS hours,
                SUM(timesheet_items.cost) AS cost,
                SUM(timesheet_items.travel_distance) AS travel_distance,
                SUM(timesheet_items.travel_cost) AS travel_cost,
                SUM(timesheet_items.total_expense) AS total_expense,
                SUM(timesheet_items.cost + timesheet_items.travel_cost + timesheet_items.total_expense) AS total_cost
            FROM
                purchase_orders
            LEFT JOIN
                assignments ON assignments.purchase_order_id = purchase_orders.id
            LEFT JOIN
                timesheets ON timesheets.assignment_id = assignments.id
            LEFT JOIN
                timesheet_items ON timesheet_items.timesheet_id = timesheets.id
            WHERE
                timesheets.deleted_at IS NULL AND timesheet_items.deleted_at IS NULL
            GROUP BY
                purchase_orders.id, DATE_FORMAT(timesheet_items.date, '%Y-%m')
            ORDER BY
                purchase_order_id, month;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS purchase_order_monthly_usages;");
    }
};
