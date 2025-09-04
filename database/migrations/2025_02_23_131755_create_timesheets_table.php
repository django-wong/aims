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
        Schema::create('timesheets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->date('start');
            $table->date('end');

            // Updated by triggers
            $table->integer('hours')->default(0)->comment('Total hours worked');
            $table->integer('travel_distance')->default(0)->comment('Total kilometers/miles traveled');
            $table->decimal('cost', 10)->default(0.00)->comment('Total cost for the timesheet, computed from the mileage, hourly rate, and any additional expenses');

            $table->unsignedTinyInteger('status')->default(0)->index()->comment(
                'Status of the timesheet:
                 0 = draft,
                 1 = reviewing,
                 2 = approved - waiting for contract holder approval
                 3 = contract holder approved - waiting for client approval,
                 4 = client approved - waiting for invoicing,
                 5 = invoiced'
            );

            $table->timestamp('signed_off_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('contract_holder_approved_at')->nullable();
            $table->timestamp('client_approved_at')->nullable();

            // The invoiced timestamps for invoices that goes to contractor and client
            $table->foreignId('contractor_invoice_id')->nullable()->constrained('invoices')->onDelete('set null');
            $table->foreignId('client_invoice_id')->nullable()->constrained('invoices')->onDelete('set null');

            $table->timestamps();
            $table->softDeletes();
            $table->index(['assignment_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timesheets');
    }
};
