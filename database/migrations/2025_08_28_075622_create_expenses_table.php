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
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')->index()->constrained()->onDelete('cascade');
            $table->foreignId('timesheet_id')->index()->constrained()->onDelete('cascade');
            $table->foreignId('timesheet_item_id')->index()->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->index()->constrained()->onDelete('cascade');
            $table->foreignId('assignment_inspector_id')->index()->constrained()->onDelete('cascade');
            $table->decimal('net_amount', 10);
            $table->decimal('gst', 10)->default(0);
            $table->decimal('process_fee')->default(0)->comment('GST free processing fee charged by creditor');
            $table->decimal('amount', 10)->storedAs('net_amount + gst + process_fee');

            $table->string('type')->comment('Type of expense: travel, meals, accommodation, other');

            $table->string('invoice_number')->nullable();
            $table->string('creditor')->nullable();
            $table->string('description')->nullable();
            $table->string('report_number')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
