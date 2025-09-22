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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('org_id')->index()->constrained();
            $table->foreignId('project_type_id')->nullable()->constrained();
            $table->foreignId('client_id')->nullable()->constrained();
            $table->string('title')->index();
            $table->string('number')->nullable()->index()->comment('YYYY-REGION-XXXX where YYYY is the year, REGION is the region code like AUS, and XXXX is a sequential number');

            $table->decimal('commission_rate')->default(7.5)->comment('The commission rate as a percentage (e.g., 5.00 for 5%)');
            $table->decimal('process_fee_rate')->default(0.00)->comment('The processing fee rate for all expenses as a percentage (e.g., 2.50 for 2.5%)');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['org_id', 'title', 'client_id', 'project_type_id', 'number']);
            $table->unique(['org_id', 'number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
