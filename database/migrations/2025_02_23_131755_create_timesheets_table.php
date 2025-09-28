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
            $table->string('week')->storedAs("DATE_FORMAT(start, '%x-W%v')")->index()->comment('Year and week number, e.g. 2023-W05');

            // Updated by triggers
            $table->integer('hours')->default(0)->comment('Total hours worked');
            $table->integer('travel_distance')->default(0)->comment('Total kilometers/miles traveled');
            $table->decimal('expenses', 10)->default(0.00)->comment('Total expenses claimed');
            $table->decimal('cost', 10)->default(0.00)->comment('Total cost for the timesheet, computed from the travel distance, hours spend, and any additional expenses');
            $table->decimal('hour_cost', 10)->default(0.00)->comment('Cost for hours spend');
            $table->decimal('travel_cost', 10)->default(0.00)->comment('Cost for travel distance');

            $table->unsignedTinyInteger('status')->default(0)->index()->comment(
                'Status of the timesheet:
                 0 = draft,
                 1 = reviewing
                 2 = approved - waiting for client approval
                 3 = client approved - waiting for invoicing,
                 4 = invoiced',
            );

            $table->unsignedTinyInteger('previous_status')->comment('The previous status before rejection, to allow reverting back')->nullable();

            $table->boolean('rejected')->default(false);
            $table->text('rejection_reason')->nullable();

            $table->boolean('late')->default(false)->comment('Is the timesheet late?');
            $table->unsignedTinyInteger('issue_code')->nullable();

            // 0 = draft, 1 = submitted, 2 =

            $table->timestamp('signed_off_at')->nullable()->comment('When did inspector sign off (accept) the timesheet');
            $table->timestamp('approved_at')->nullable()->comment('When did the coordinator approve the timesheet');
            $table->timestamp('client_approved_at')->nullable();
            $table->timestamp('client_reminder_sent_at')->nullable()->comment('Timesheet and report reminder for client, it should be sent 2 days after approved_at ');

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
