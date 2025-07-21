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
            $table->string('po_number')->nullable()->index();
            $table->decimal('budget', 15, 2)->default(0.00);
            $table->foreignId('quote_id')->nullable()->constrained()->comment('The quote associated with this project, if any');
            $table->tinyInteger('status')->default(0)->comment('0: Draft, 1: Open, 2: Closed')->index();
            $table->timestamps();

            $table->index(['org_id', 'title', 'status', 'po_number']);
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
