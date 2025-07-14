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
            $table->string('item_number')->nullable();
            $table->date('date')->nullable();
            $table->unsignedInteger('week_number')->nullable()->comment('Week number of the year');
            $table->string('country')->nullable();
            $table->integer('hours')->default(0)->comment('Hours worked on this item');
            $table->integer('km_traveled')->default(0)->comment('Kilometers traveled for this item');
            $table->timestamps();
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
