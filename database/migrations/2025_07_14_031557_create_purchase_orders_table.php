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
            $table->foreignId('org_id')->constrained();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('vendor_id')->constrained();
            $table->foreignId('sub_vendor_id')->nullable()->constrained('vendors');
            $table->foreignId('purchase_order_category_id')->nullable()->constrained();
            $table->longText('description')->nullable();
            $table->longText('notes')->nullable();
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
