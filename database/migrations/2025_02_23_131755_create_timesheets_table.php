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
            $table->integer('hours')->default(0)->comment('Total hours worked');
            $table->integer('travel_distance')->default(0)->comment('Total kilometers/miles traveled');
            $table->decimal('cost', 10)->default(0.00)->comment('Total amount for the timesheet, computed from the mileage, hourly rate, and any additional expenses');
            $table->longText('report')->nullable()->comment('The weekly report that will submitted as part of the timesheet');
            $table->unsignedTinyInteger('status')->default(0)->comment('Status of the timesheet: 0 = draft, 1 = reviewing, 2 = approved, 3 = client approved');
            $table->timestamps();
            $table->softDeletes();
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
