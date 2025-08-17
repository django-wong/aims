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
        Schema::create('budgets', function (Blueprint $table) {
            $table->id();
            $table->string('rate_code')->index();
            $table->foreignId('purchase_order_id')->index()->constrained();
            $table->foreignId('assignment_type_id')->index()->constrained();
            $table->decimal('hourly_rate', 10);
            $table->decimal('budgeted_hours', 10);
            $table->decimal('travel_rate', 10)->default(0.5);
            $table->decimal('budgeted_mileage', 10)->default(0);
            $table->timestamps();
            $table->softDeletes();
            $table->index(['purchase_order_id', 'assignment_type_id']);
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
