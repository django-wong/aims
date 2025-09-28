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
            CREATE OR REPLACE VIEW invoice_details AS
            select invoices.*,
                   purchase_orders.title                           as purchase_order_title,
                   purchase_orders.currency                        as currency,
                   purchase_orders.mileage_unit                    as travel_unit,
                   invoiceable.name                                as invoiceable_org_name,
                   invoiceable_client.business_name                as invoiceable_client_business_name,
                   COUNT(timesheets.id)                            as timesheet_count,
                   SUM(timesheets.hours)                           as hours,
                   SUM(timesheets.travel_distance)                 as travel_distance,
                   SUM(timesheets.expenses)                        as expenses,
                   SUM(timesheets.hour_cost)                       as hour_cost,
                   SUM(timesheets.travel_cost)                     as travel_cost,
                   SUM(timesheets.cost)                            as cost,
                   MIN(timesheets.start)                           as start,
                   MAX(timesheets.end)                             as end,
                   projects.title                                  as project_title,
                   projects.id                                     as project_id,
                   projects.commission_rate                        as commission_rate,
                   projects.process_fee_rate                       as process_fee_rate,
                   projects.commission_rate / 100 * SUM(hour_cost) as commission,
                   projects.process_fee_rate / 100 * SUM(expenses) as process_fee,
                   IF(invoices.invoiceable_type = 'App\\\Models\\\Client', 1, 0) as is_client_invoice,
                   IF(invoices.invoiceable_type = 'App\\\Models\\\Client',
                      (SUM(timesheets.expenses) + SUM(timesheets.hour_cost) + SUM(timesheets.travel_cost)) +
                      (projects.process_fee_rate / 100 * SUM(timesheets.expenses)),
                      SUM(cost) - (projects.commission_rate / 100 * SUM(hour_cost))
                   ) as final_cost
            from invoices
                     left join purchase_orders on invoices.purchase_order_id = purchase_orders.id
                     left join orgs as invoiceable on invoices.invoiceable_id = invoiceable.id and invoices.invoiceable_type = 'App\\\Models\\\Org'
                     left join clients as invoiceable_client on invoiceable_client.id = invoices.invoiceable_id and invoices.invoiceable_type = 'App\\\Models\\\Client'
                     left join timesheets on invoices.id = timesheets.client_invoice_id or invoices.id = timesheets.contractor_invoice_id
                     left join projects on purchase_orders.project_id = projects.id
            group by invoices.id;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::unprepared("DROP VIEW IF EXISTS invoice_details;");
    }
};
