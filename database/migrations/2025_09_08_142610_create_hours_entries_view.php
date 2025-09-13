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
        \Illuminate\Support\Facades\DB::statement("
            CREATE OR REPLACE VIEW hours_entries AS
               select assignments.id                                               as assignment_id,
               assignments.org_id                                                  as org_id,
               assignments.operation_org_id                                        as operation_org_id,
               assignments.reference_number                                        as reference_number,
               min(assignment_inspectors.created_at)                               as issued_at,
               users.name                                                          as inspector_name,
               assignments.notes                                                   as notes,
               CONCAT(min(timesheet_items.date), ' - ', max(timesheet_items.date)) as date_range,
               skills.i_e_a                                                        as I_E_A,
               timesheets.client_approved_at                                       as approved_at,
               'TODO'                                                              as report_number,
               clients.business_name                                               as client_name,
               clients.code                                                        as client_code,
               orgs.name                                                           as org_name,
               operation_org.name                                                  as operation_org_name,
               main_vendor.name                                                    as main_vendor_name,
               main_vendor_address.address_line_1                                  as main_vendor_address,
               sub_vendor.name                                                     as sub_vendor_name,
               sub_vendor_address.address_line_1                                   as sub_vendor_address,
               sum(timesheet_items.work_hours)                                     as work_hours,
               sum(timesheet_items.travel_hours)                                   as travel_hours,
               sum(timesheet_items.report_hours)                                   as report_hours,
               count(timesheet_items.id)                                           as days,
               sum(timesheet_items.overnights)                                     as overnights,
               sum(timesheet_items.total_expense)                                  as total_expenses,
               sum(timesheet_items.meals)                                          as meals,
               sum(timesheet_items.rail_or_airfare)                                as rail_or_airfare,
               sum(timesheet_items.cost)                                           as hour_fee,
               sum(timesheet_items.travel_cost)                                    as travel_fee,
               'TODO'                                                              as invoice_amount,
               'TODO'                                                              as client_invoice_number,
               'TODO'                                                              as contractor_invoice_number,
               'TODO'                                                              as vat
            from assignments
               left join timesheets on timesheets.assignment_id = assignments.id
               left join assignment_inspectors on assignment_inspectors.assignment_id = assignments.id
               left join projects on projects.id = assignments.project_id
               left join clients on projects.client_id = clients.id
               left join users on users.id = assignment_inspectors.user_id
               left join timesheet_items on timesheet_items.timesheet_id = timesheets.id
               left join vendors as main_vendor on main_vendor.id = assignments.vendor_id
               left join vendors as sub_vendor on sub_vendor.id = assignments.sub_vendor_id
               left join addresses as main_vendor_address on main_vendor_address.id = main_vendor.address_id
               left join addresses as sub_vendor_address on sub_vendor_address.id = sub_vendor.address_id
               left join skills on skills.id = assignments.skill_id
               left join orgs on orgs.id = assignments.org_id
               left join orgs as operation_org on operation_org.id = assignments.operation_org_id
            where timesheet_items.id is not null
            group by assignments.id, timesheets.id, assignment_inspectors.user_id;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::statement("DROP VIEW IF EXISTS hours_entries;");
    }
};
