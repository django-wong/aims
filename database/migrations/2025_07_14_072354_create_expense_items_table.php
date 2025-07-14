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
        Schema::create('expense_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('expense_id')->index()->constrained();
            $table->string('item_number')->nullable()->comment('Item No. or SKU');
            $table->string('currency')->default('USD')->index()->comment('Currency code, e.g., USD, EUR');
            $table->decimal('amount', 10)->comment('Expense amount');
            $table->decimal('exchange_rate_to_usd', 10, 6)->default(1.0);
            $table->decimal('amount_in_usd', 10);
            $table->date('date')->nullable();
            $table->longText('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expense_items');
    }
};
