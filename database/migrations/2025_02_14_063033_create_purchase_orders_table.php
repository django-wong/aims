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
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->string('title')->index();
            $table->string('previous_title')->nullable()->comment('To track title changes');
            $table->foreignId('org_id')->constrained();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('quote_id')->nullable()->constrained();

            $table->string('mileage_unit', 10, 2)->default('km')->comment('km or miles');
            $table->string('currency', 3)->default('AUD');

            $table->decimal('total_hours', 10, 2)->default(0.00);
            $table->decimal('total_mileage', 10, 2)->default(0.00);
            $table->decimal('total_cost', 15, 2)->default(0.00);

            $table->decimal('budget', 15, 2)->default(0.00);
            $table->decimal('budgeted_hours', 10, 2)->default(0.00);
            $table->decimal('budgeted_mileage', 10, 2)->default(0.00);

            // Usage of hours
            $table->decimal('usage')->storedAs(
                'CASE WHEN budgeted_hours > 0 THEN total_hours / budgeted_hours ELSE 0 END'
            );

            foreach (['first', 'second', 'final'] as $stage) {
                $table->unsignedInteger($stage.'_alert_threshold')->default(70);
                $table->timestamp($stage.'_alert_at')->nullable();
            }

            $table->index(['org_id', 'project_id']);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_orders');
    }
};
