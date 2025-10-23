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
            select assignments.id                                                      as assignment_id,
                   timesheets.id                                                       as timesheet_id,
                   assignments.org_id                                                  as org_id,
                   assignments.operation_org_id                                        as operation_org_id,
                   assignments.reference_number                                        as reference_number,
                   assignments.equipment                                               as equipment_description,
                   users.name                                                          as inspector_name,
                   assignments.notes                                                   as notes,
                   CONCAT(min(timesheet_items.date), ' - ', max(timesheet_items.date)) as date_range,
                   skills.i_e_a                                                        as I_E_A,
                   skills.code                                                         as skill_code,
                   assignment_types.name                                               as assignment_type_name,
                   timesheets.issue_code                                               as issue_code,
                   assignment_inspectors.created_at                                    as issued_at,
                   timesheets.approved_at                                              as approved_at,
                   assignments.first_visit_date                                        as first_visit_date,
                   timesheets.flash_report_sent                                        as flast_report_sent,
                   assignments.close_date                                              as closed_date,
                   timesheets.signed_off_at                                            as recorded_at,
                   timesheets.client_approved_at                                       as client_approved_at,
                   inspection_reports.report_numbers                                   as report_number,
                   clients.business_name                                               as client_name,
                   clients.code                                                        as client_code,
                   clients.client_group                                                as client_group,
                   orgs.name                                                           as org_name,
                   operation_org.name                                                  as operation_org_name,
                   projects.title                                                      as project_title,
                   project_types.name                                                  as project_type,
                   main_vendor.name                                                    as main_vendor_name,
                   main_vendor_address.address_line_1                                  as main_vendor_address,
                   sub_vendor.name                                                     as sub_vendor_name,
                   sub_vendor_address.address_line_1                                   as sub_vendor_address,
                   sum(timesheet_items.work_hours)                                     as work_hours,
                   sum(timesheet_items.travel_hours)                                   as travel_hours,
                   sum(timesheet_items.report_hours)                                   as report_hours,
                   timesheets.hours                                                    as total_hours,
                   timesheets.travel_distance                                          as travel_distance,
                   purchase_orders.travel_unit                                         as travel_unit,
                   count(timesheet_items.id)                                           as days,
                   sum(timesheet_items.overnights)                                     as overnights,
                   sum(timesheet_items.total_expense)                                  as total_expenses,
                   sum(timesheet_items.cost)                                           as hour_cost,
                   sum(timesheet_items.travel_cost)                                    as travel_cost,
                   sum(timesheet_items.hour_fee)                                       as hour_fee,
                   sum(timesheet_items.travel_fee)                                     as travel_fee,
                   timesheets.cost                                                     as invoice_amount,
                   client_invoice.id                                                   as client_invoice_number,
                   client_invoice.approved_at                                          as client_invoice_approved_at,
                   invoice.id                                                          as contractor_invoice_number,
                   projects.tax_rate                                                   as vat,
                   assignments.report_required                                         as report_required,
                   expenses.expenses_by_type                                           as expenses_by_type
            from timesheets
                     left join assignments on timesheets.assignment_id = assignments.id
                     left join purchase_orders on assignments.purchase_order_id = purchase_orders.id
                     left join assignment_inspectors on assignment_inspectors.assignment_id = assignments.id and
                                                        assignment_inspectors.user_id = timesheets.user_id
                     left join assignment_types on assignment_inspectors.assignment_type_id = assignment_types.id
                     left join projects on projects.id = assignments.project_id
                     left join project_types on projects.project_type_id = project_types.id
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
                     left join invoices as client_invoice on timesheets.client_invoice_id = client_invoice.id
                     left join invoices as invoice on timesheets.contractor_invoice_id = invoice.id
                     left join (select timesheet_id, GROUP_CONCAT(report_no SEPARATOR ',') as report_numbers
                                from timesheet_reports
                                where type = 'inspection-report'
                                group by timesheet_id) as inspection_reports on inspection_reports.timesheet_id = timesheets.id
                     left join (select timesheet_id, JSON_OBJECTAGG(expenses.type, expenses.amount) as expenses_by_type
                                from expenses
                                group by timesheet_id) as expenses on expenses.timesheet_id = timesheets.id
            group by timesheets.id;
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
