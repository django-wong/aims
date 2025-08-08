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
            $table->integer('hours')->storedAs(
                'work_hours + travel_hours + report_hours'
            )->comment('Total hours calculated from individual components');
            $table->integer('work_hours')->default(0);
            $table->integer('travel_hours')->default(0);
            $table->integer('report_hours')->default(0);
            $table->decimal('hourly_rate', 10, 2)->default(0.00)->comment('Rate per hour for work');
            $table->decimal('cost', 10, 2)->storedAs(
                'work_hours * hourly_rate + travel_hours * hourly_rate + report_hours * hourly_rate'
            );
            $table->integer('days')->default(0);
            $table->integer('overnights')->default(0);
            $table->integer('km_traveled')->default(0)->comment('Kilometers traveled for this item');
            $table->integer('travel_rate')->default(0)->comment('Rate per distance unit for travel');
            $table->decimal('travel_cost', 10, 2)->storedAs(
                'km_traveled * travel_rate'
            );
            $table->boolean('approved')->default(false);
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
