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
        Schema::create('timesheet_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('timesheet_id')->constrained();
            $table->foreignId('user_id');
            $table->string('item_number')->nullable();
            $table->date('date')->nullable();
            $table->unsignedInteger('week_number')->nullable()->comment('Week number of the year');

            // Work hours
            $table->integer('report_hours')->default(0);
            $table->integer('work_hours')->default(0);
            $table->integer('travel_hours')->default(0);
            $table->decimal('hourly_rate', 10, 2)->default(0.00)->comment('Rate per hour for work');
            $table->integer('hours')->storedAs(
                'work_hours + travel_hours + report_hours'
            )->comment('Total hours calculated from individual components');
            $table->decimal('cost', 10, 2)->storedAs(
                '(work_hours + travel_hours + report_hours) * hourly_rate'
            );

            // Maybe not needed as we can calculate how many days the inspectors worked for the assignment
            $table->integer('days')->default(0);
            $table->integer('overnights')->default(0);

            // Travel
            $table->integer('travel_distance')->default(0);
            $table->integer('travel_rate')->default(0)->comment('Rate per distance unit for travel');
            $table->decimal('travel_cost', 10, 2)->storedAs(
                'travel_distance * travel_rate'
            );

            $table->decimal('total_expense', 10, 2)->default(0)->comment('Calculated');

            $table->decimal('pay_rate', 10, 2)->default(0.00)->comment('Pay rate per hour for the inspector');
            $table->decimal('pay_travel_rate', 10, 2)->default(0.00)->comment('Pay rate per distance unit for travel');

            $table->decimal('hour_fee', 10, 2)->storedAs('(work_hours + travel_hours + report_hours) * pay_rate')->comment('Calculated pay for hours worked');
            $table->decimal('travel_fee', 10, 2)->storedAs('travel_distance * pay_travel_rate')->comment('Calculated pay for travel');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timesheet_items');
    }
};
