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
            $table->string('po_number')->nullable()->index();
            $table->decimal('budget', 15, 2)->default(0.00);
            $table->foreignId('quote_id')->nullable()->constrained()->comment('The quote associated with this project, if any');
            $table->tinyInteger('status')->default(0)->comment('0: Draft, 1: Open, 2: Closed')->index();

            $table->unsignedTinyInteger('first_alert_threshold')->default(70)->comment('The first alert threshold for the project');
            $table->timestamp('first_alert_at')->nullable();
            $table->unsignedTinyInteger('second_alert_threshold')->default(90)->comment('The second alert threshold for the project');
            $table->timestamp('second_alert_at')->nullable();
            $table->unsignedTinyInteger('final_alert_threshold')->default(100);
            $table->timestamp('final_alert_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['org_id', 'title', 'status', 'po_number']);
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
