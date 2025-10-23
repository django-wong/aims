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

            $table->string('travel_unit', 10, 2)->default('km')->comment('km or miles');
            $table->string('currency', 3)->default('AUD');

            /**
             * Calculated fields - these are calculated from related tables (timesheets, expenses, budgets)
             * and stored here for performance reasons.
             */
            $table->decimal('total_hours', 10, 2)->default(0.00)->comment('Calculated');
            $table->decimal('total_travel', 10, 2)->default(0.00)->comment('Calculated');

            $table->decimal('hour_cost', 15, 2)->default(0.00)->comment('Calculated');
            $table->decimal('travel_cost', 15, 2)->default(0.00)->comment('Calculated');
            $table->decimal('expenses', 15, 2)->default(0.00)->comment('Calculated');
            $table->decimal('total_cost', 15, 2)->default(0.00)->comment('Calculated');

            $table->decimal('budgeted_hours', 10, 2)->default(0.00);
            $table->decimal('budgeted_travel', 10, 2)->default(0.00);
            $table->decimal('budgeted_expenses', 15, 2)->default(0.00);

            $table->decimal('budget', 15, 2)->default(0.00)->comment('The total budget including hours, travel and expenses. Calculated from budgets table');

            /**
             * Stored generated columns for usage percentages
             * These are calculated as:
             * - usage = total_hours / budgeted_hours
             * - travel_usage = total_travel / budgeted_travel
             * - budget_usage = total_cost / budget
             * If budgeted_hours, budgeted_travel or budget is 0, the usage is set to 0 to avoid division by zero.
             */
            $table->decimal('usage')->storedAs('CASE WHEN budgeted_hours > 0 THEN total_hours / budgeted_hours ELSE 0 END');
            $table->decimal('travel_usage')->storedAs('CASE WHEN budgeted_travel > 0 THEN total_travel / budgeted_travel ELSE 0 END');
            $table->decimal('budget_usage')->storedAs('CASE WHEN budget > 0 THEN total_cost / budget ELSE 0 END');

            foreach (['first' => 50, 'second' => 70, 'final' => 90] as $stage => $percent) {
                $table->unsignedInteger($stage.'_alert_threshold')->default($percent);
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
