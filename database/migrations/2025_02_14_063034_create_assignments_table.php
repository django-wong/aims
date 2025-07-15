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
            $table->foreignId('client_id')->constrained();
            $table->foreignId('project_id')->constrained();

            $table->string('client_po')->nullable()->comment('Client Purchase Order Number');
            $table->date('po_delivery_date')->nullable()->comment('Client Purchase Order Delivery Date');
            $table->foreignId('vendor_id')->nullable()->constrained();
            $table->foreignId('sub_vendor_id')->nullable()->constrained('vendors');

            $table->boolean('report_required')->default(false)->comment('Indicates if a report is required for this assignment');


            $table->longText('description')->nullable()->comment('Description of the assignment');
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
