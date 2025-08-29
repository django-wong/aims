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

            $table->string('doc_no')->nullable();
            $table->string('rev')->nullable();
            $table->date('visit_date')->nullable();
            $table->string('report_no')->nullable();
            $table->foreignId('vendor_id')->nullable();
            $table->string('raised_by')->nullable();
            $table->string('rev_date')->nullable();
            $table->foreignId('closed_or_rev_by_id')->nullable();
            $table->date('closed_date')->nullable();
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
