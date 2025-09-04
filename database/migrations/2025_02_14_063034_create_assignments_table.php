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
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->boolean('delegated')->default(false);
            $table->string('reference_number')->nullable();
            $table->string('previous_reference_number')->nullable();

            $table->foreignId('org_id')->index()->constrained();
            $table->foreignId('coordinator_id')->nullable()->index()->constrained('users');

            $table->foreignId('operation_org_id')->nullable()->index()->constrained('orgs');
            $table->foreignId('operation_coordinator_id')->nullable()->index()->constrained('users');

            $table->string('approved_by')->nullable();

            $table->foreignId('project_id')->constrained();
            $table->foreignId('purchase_order_id')->nullable()->constrained();

            $table->string('client_po')->nullable();
            $table->string('client_po_rev')->nullable();
            $table->date('po_delivery_date')->nullable();
            $table->date('close_date')->nullable();
            $table->date('final_invoice_date')->nullable();

            $table->string('i_e_a')->nullable();

            // budget
            $table->decimal('budgeted_hours', 8, 2)->nullable()->comment('Total budgeted hours for the assignment, can not beyond the purchase order');
            $table->decimal('budgeted_travel', 10, 2)->nullable()->comment('Hourly rate for the assignment');

            // status
            $table->unsignedTinyInteger('status')->default(0)->comment(
                '0 = Draft, 1 = Issued, 2 = Rejected, 3 = Accepted, 4 = Assigned, 5 = Partial Acked, 6 = Acked, 7 = Open, 8 = Closed'
            );

            // Equipment/Skill
            $table->foreignId('skill_id')->nullable()->constrained()->nullOnDelete();
            $table->longText('equipment')->nullable()->comment('Equipment used during the assignment');

            // Vendors
            $table->foreignId('vendor_id')->nullable()->constrained();
            $table->foreignId('sub_vendor_id')->nullable()->constrained('vendors');
            $table->boolean('report_required')->default(false)->comment('Indicates if a report is required for this assignment');

            // visit
            $table->date('first_visit_date')->nullable()->comment('First visit date if known');
            $table->string('visit_frequency')->nullable()->comment('Frequency of visits (e.g., weekly, monthly)');
            $table->unsignedInteger('total_visits')->nullable()->comment('Total number of visits planned for the assignment');
            $table->unsignedTinyInteger('hours_per_visit')->nullable()->comment('Estimated hours per visit');
            $table->foreignId('visit_contact_id')->nullable()->comment('contact on vendor side')->constrained('contacts');

            // instructions
            $table->text('inter_office_instructions')->nullable();
            $table->text('inspector_instructions')->nullable();

            // scope of assignment (booleans)
            $table->boolean('pre_inspection_meeting')->default(false);
            $table->boolean('final_inspection')->default(false);
            $table->boolean('dimensional')->default(false);
            $table->boolean('sample_inspection')->default(false);
            $table->boolean('witness_of_tests')->default(false);
            $table->boolean('monitoring')->default(false);
            $table->boolean('packing')->default(false);
            $table->boolean('document_review')->default(false);
            $table->boolean('expediting')->default(false);
            $table->boolean('audit')->default(false);

            // Status/flash report/exit call
            $table->boolean('exit_call')->default(false)->comment('Indicates if an exit call is required');
            $table->boolean('flash_report')->default(false)->comment('Indicates if a flash report is required');
            $table->foreignId('client_contact_id')->nullable()->constrained('contacts');

            // reporting and documentation
            $table->tinyInteger('reporting_format')->default(0)->comment('Reporting format: 0 = bie, 1 = client');
            $table->tinyInteger('reporting_frequency')->default(0)->comment('Reporting frequency: 0 = daily, 1 = weekly');
            $table->tinyInteger('send_report_to')->nullable()->comment('0 = BIE, 1 = Client, 2 = Both');
            $table->tinyInteger('timesheet_format')->default(0)->comment('Timesheet format: 0 = bie, 1 = client');
            $table->tinyInteger('ncr_format')->default(0)->comment('NCR format: 0 = bie, 1 = client');
            $table->tinyInteger('punch_list_format')->default(0)->comment('Punch list format: 0 = bie, 1 = client');
            $table->tinyInteger('irn_format')->default(0)->comment('IRN format: 0 = bie, 1 = client');
            $table->tinyInteger('document_stamp')->default(0)->comment('Document stamp: 0 = bie, 1 = sign');
            $table->tinyInteger('issue_irn_to_vendor')->default(0)->comment('Issue IRN to vendor: 0 = NO, 1 = YES');

            // Notes
            $table->longText('notes')->nullable()->comment('Notes of the assignment');
            $table->longText('special_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assignments');
    }
};
