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
            $table->foreignId('project_id')->constrained();
            $table->foreignId('inspector_id')->index()->nullable()->constrained('users');
            $table->foreignId('vendor_id')->nullable()->constrained();
            $table->foreignId('sub_vendor_id')->nullable()->constrained('vendors');

            $table->boolean('report_required')->default(false)
                ->comment('Indicates if a report is required for this assignment');

            $table->longText('notes')->nullable()
                ->comment('Notes of the assignment');
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
