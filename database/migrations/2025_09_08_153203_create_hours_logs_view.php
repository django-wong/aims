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
            CREATE OR REPLACE VIEW hours_logs AS
            select
                timesheet_items.id,
                users.name as inspector_name,
                clients.client_group as client_group,
                clients.business_name as client_name,
                clients.code as client_code
                assignments.reference_number as reference_number,
                'TODO' as report_number,
                projects.title as project_title,
                project_types.name as project_type,
                main_vendor.name as main_vendor_name,
                main_vendor_address.address_line_1 as main_vendor_address_line_1,
                assignments.equipment as equipment_description,
                skills.code as skill_name,
                skills.i_e_a as i_e_a,
                timesheet_items.date as visit_date,
                timesheet_items.created_at as recorded_at,
                'TODO' as flash_report_sent,
                'TODO (remote, desk review, onsite)' as work_type,
                'TODO' as problem,
                assignment_inspectors.created_at as issued_at,
                timesheet_items.work_hours as work_hours,
                timesheet_items.travel_hours as travel_hours,
                timesheet_items.report_hours as report_hours,
                timesheet_items.hours as total_hours,
                timesheet_items.overnights as overnights,
                timesheet_items.travel_distance as travel_distance,
                timesheets.client_approved_at as client_approved_at,
                assignments.report_required as report_required,
                'TODO' as order_received_date,
                IF(assignments.close_date is null, 'open', 'closed') as status,
                assignments.close_date as close_date,
                assignments.org_id as org_id,
                orgs.name as org_name,
                'TODO' as client_invoice_number,
                'TODO' as contractor_invoice_number,
                timesheet_items.cost as hour_cost,
                timesheet_items.travel_cost as travel_cost,
                timesheet_items.meals as meal,
                timesheet_items.rail_or_airfare as rail_or_airfare,
                timesheet_items.hotel as hotel,
                timesheet_items.other as other,
                timesheet_items.total_expense as total_expense,
                'TODO' as invoice_amount,
                'TODO' as vat
            from timesheet_items
            left join timesheets on timesheet_items.timesheet_id = timesheets.id
            left join assignment_inspectors on assignment_inspectors.assignment_id = timesheets.assignment_id and assignment_inspectors.user_id  = timesheets.user_id
            left join users on timesheets.user_id = users.id
            left join assignments on timesheets.assignment_id = assignments.id
            left join projects on assignments.project_id = projects.id
            left join project_types on projects.project_type_id = project_types.id
            left join clients on projects.client_id = clients.id
            left join vendors as main_vendor on assignments.vendor_id = main_vendor.id
            left join addresses as main_vendor_address on main_vendor.address_id = main_vendor_address.id
            left join skills on assignments.skill_id = skills.id
            left join orgs on assignments.org_id = orgs.id
            order by timesheet_items.date desc
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::statement("DROP VIEW IF EXISTS hours_logs");
    }
};
