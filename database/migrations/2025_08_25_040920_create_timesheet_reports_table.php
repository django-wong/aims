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
        Schema::create('timesheet_reports', function (Blueprint $table) {
            $table->id()->comment('A file report associated with a timesheet, user can also upload a revision of the report.');
            $table->foreignId('timesheet_id')->constrained()->onDelete('cascade');
            $table->string('type')->default('attachment');
            $table->boolean('is_closed')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timesheet_reports');
    }
};
