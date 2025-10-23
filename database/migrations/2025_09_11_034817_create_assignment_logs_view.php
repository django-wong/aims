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
            CREATE OR REPLACE VIEW assignment_logs AS
            select
                assignments.*,
                clients.client_group as client_group,
                clients.business_name as client_business_name,
                clients.id as client_id,
                operation_orgs.name as operation_org_name,
                orgs.name as org_name,
                projects.title as project_title,
                project_types.id as project_type_id,
                project_types.name as project_type_name,
                purchase_orders.title as purchase_order_title,
                purchase_orders.budgeted_hours as purchase_order_budgeted_hours,
                purchase_orders.budgeted_travel as purchase_order_budgeted_travel,
                skills.code as skill_code,
                skills.i_e_a as skill_i_e_a
            from assignments
            left join projects on assignments.project_id = projects.id
            left join project_types on projects.project_type_id = project_types.id
            left join clients on projects.client_id = clients.id
            left join purchase_orders on assignments.purchase_order_id = purchase_orders.id
            left join orgs on assignments.org_id = orgs.id
            left join orgs as operation_orgs on assignments.operation_org_id = operation_orgs.id
            left join vendors as main_vendor on main_vendor.id = assignments.vendor_id
            left join vendors as sub_vendor on sub_vendor.id = assignments.sub_vendor_id
            left join skills on assignments.skill_id = skills.id;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::unprepared("DROP VIEW IF EXISTS assignment_logs;");
    }
};
