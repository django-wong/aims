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
        CREATE OR REPLACE VIEW assignment_details AS
        select
            assignments.*,
            projects.title as project_title,
            clients.business_name as client_business_name,
            clients.client_group as client_group,
            clients.code as client_code,
            purchase_orders.title as purchase_order_title,
            purchase_orders.previous_title as purchase_order_previous_title,
            purchase_orders.currency as currency,
            purchase_orders.mileage_unit as travel_unit,
            purchase_orders.budgeted_hours as budgeted_hours,
            purchase_orders.budgeted_mileage as budgeted_mileage,
            purchase_orders.budgeted_expenses as budgeted_expenses,
            skills.code as skill_code,
            skills.i_e_a as i_e_a,
            orgs.name as org_name,
            operation_orgs.name as operation_org_name,
            main_vendor.name as main_vendor_name,
            sub_vendor.name as sub_vendor_name,
            coordinator.name as coordinator_name,
            operation_coordinator.name as operation_coordinator_name
        from assignments
            left join projects on assignments.project_id = projects.id
            left join purchase_orders on assignments.purchase_order_id = purchase_orders.id
            left join clients on projects.client_id = clients.id
            left join skills on assignments.skill_id = skills.id
            left join orgs on assignments.org_id = orgs.id
            left join orgs as operation_orgs on assignments.operation_org_id = operation_orgs.id
            left join vendors as main_vendor on assignments.vendor_id = main_vendor.id
            left join vendors as sub_vendor on assignments.sub_vendor_id = sub_vendor.id
            left join users as coordinator on assignments.coordinator_id = coordinator.id
            left join users as operation_coordinator on assignments.operation_coordinator_id = operation_coordinator.id
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::unprepared("DROP VIEW IF EXISTS assignment_details");
    }
};
