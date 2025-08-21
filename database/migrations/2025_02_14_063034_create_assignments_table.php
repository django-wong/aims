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

            $table->foreignId('org_id')
                ->index()
                ->constrained();

            $table->foreignId('operation_org_id')
                ->nullable()
                ->index()
                ->constrained('orgs');

            $table->foreignId('assignment_type_id')->index()->nullable()->constrained();
            $table->foreignId('project_id')->constrained();
            $table->foreignId('inspector_id')->index()->nullable()->constrained('users');
            $table->foreignId('vendor_id')->nullable()->constrained();
            $table->foreignId('sub_vendor_id')->nullable()->constrained('vendors');
            $table->foreignId('purchase_order_id')->nullable()->constrained();
            $table->boolean('report_required')->default(false)->comment('Indicates if a report is required for this assignment');

            // visit
            $table->date('first_visit_date')->nullable()->comment('First visit date if known');
            $table->string('visit_frequency')->nullable()->comment('Frequency of visits (e.g., weekly, monthly)');
            $table->unsignedInteger('total_visits')->nullable()->comment('Total number of visits planned for the assignment');
            $table->unsignedTinyInteger('hours_per_visit')->nullable()->comment('Estimated hours per visit');
            $table->foreignId('visit_contact_id')->nullable()->constrained('contacts');

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
            $table->string('contact_details')->nullable()->comment('Contact details for the assignment');
            $table->string('contact_email')->nullable()->comment('Contact email for the assignment');

            $table->longText('equipment')->nullable()->comment('Equipment used during the assignment');
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
