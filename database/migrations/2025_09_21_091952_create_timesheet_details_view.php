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
            CREATE OR REPLACE VIEW timesheet_details AS
            select
                timesheets.*,
                inspector.name                       as inspector_name,
                assignments.reference_number         as reference_number,
                assignments.previous_reference_number as previous_reference_number,
                assignments.org_id                   as org_id,
                assignments.operation_org_id         as operation_org_id,
                assignments.vendor_id                as main_vendor_id,
                assignments.sub_vendor_id            as sub_vendor_id,
                assignments.project_id               as project_id,
                assignments.coordinator_id           as coordinator_id,
                assignments.operation_coordinator_id as operation_coordinator_id,
                assignments.skill_id                 as skill_id,
                projects.title                       as project_title,
                projects.client_id                   as client_id,
                clients.business_name                as client_business_name,
                clients.client_group                 as client_group,
                clients.code                         as client_code,
                purchase_orders.title                as purchase_order_title,
                purchase_orders.previous_title       as purchase_order_previous_title,
                purchase_orders.currency             as currency,
                purchase_orders.travel_unit         as travel_unit,
                budgets.budgeted_hours               as budgeted_hours,
                budgets.budgeted_travel             as budgeted_travel,
                budgets.budgeted_expenses            as budgeted_expenses,
                assignment_inspectors.hourly_rate    as hourly_rate,
                assignment_inspectors.travel_rate    as travel_rate,
                inspector_profiles.hourly_rate       as inspector_hourly_rate,
                inspector_profiles.travel_rate       as inspector_travel_rate,
                skills.code                          as skill_code,
                skills.i_e_a                         as i_e_a,
                orgs.name                            as org_name,
                operation_orgs.name                  as operation_org_name,
                main_vendor.name                     as main_vendor_name,
                sub_vendor.name                      as sub_vendor_name,
                coordinator.name                     as coordinator_name,
                operation_coordinator.name           as operation_coordinator_name
            from timesheets
                left join assignments on timesheets.assignment_id = assignments.id
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
                left join users as inspector on timesheets.user_id = inspector.id
                left join assignment_inspectors on assignments.id = assignment_inspectors.assignment_id and timesheets.user_id = assignment_inspectors.user_id
                left join budgets on purchase_orders.id = budgets.purchase_order_id and budgets.assignment_type_id = assignment_inspectors.assignment_type_id
                left join inspector_profiles on inspector_profiles.user_id = timesheets.user_id;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timesheet_details');
    }
};
