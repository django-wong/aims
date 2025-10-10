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
            CREATE OR REPLACE VIEW purchase_order_budgets AS
            select purchase_orders.id as purchase_order_id,
               budgets.budgeted_hours,
               budgets.budgeted_mileage,
               budgets.budgeted_expenses,
               budgets.budgeted_hours_cost,
               budgets.budgeted_mileage_cost,
               client_invoices.invoiced_hours,
               client_invoices.invoiced_expenses,
               client_invoices.invoiced_travel_distance,
               client_invoices.invoiced_hours_cost,
               client_invoices.invoiced_travel_cost,
               assignments.claimed_hours,
               assignments.claimed_expenses,
               assignments.claimed_travel_distance
        from purchase_orders
                 left join (select purchase_order_id,
                                   sum(budgeted_hours)                 as budgeted_hours,
                                   sum(budgeted_mileage)               as budgeted_mileage,
                                   sum(budgeted_expenses)              as budgeted_expenses,
                                   sum(budgeted_hours * hourly_rate)   as budgeted_hours_cost,
                                   sum(budgeted_mileage * travel_rate) as budgeted_mileage_cost
                            from budgets
                            group by budgets.purchase_order_id) as budgets on budgets.purchase_order_id = purchase_orders.id
                 left join (select purchase_order_id,
                                   sum(timesheets.hours)           as invoiced_hours,
                                   sum(timesheets.expenses)        as invoiced_expenses,
                                   sum(timesheets.travel_distance) as invoiced_travel_distance,
                                   sum(timesheets.hour_cost)       as invoiced_hours_cost,
                                   sum(timesheets.travel_cost)     as invoiced_travel_cost
                            from invoices
                                     left join timesheets on timesheets.client_invoice_id = invoices.id
                            group by purchase_order_id) as client_invoices
                           on client_invoices.purchase_order_id = purchase_orders.id
                 left join (select assignments.purchase_order_id,
                                   sum(timesheets.hours)           as claimed_hours,
                                   sum(timesheets.expenses)        as claimed_expenses,
                                   sum(timesheets.travel_distance) as claimed_travel_distance
                            from assignments
                                     left join timesheets on timesheets.assignment_id = assignments.id
                            group by purchase_order_id) as assignments on assignments.purchase_order_id = purchase_orders.id
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::unprepared('DROP VIEW IF EXISTS purchase_order_budgets');
    }
};
