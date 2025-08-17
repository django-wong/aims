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
            $table->foreignId('org_id')->constrained();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('quote_id')->nullable()->constrained();
            $table->decimal('budget', 15, 2)->default(0.00);

            $table->unsignedInteger('first_alert_threshold')->default(70)
                ->comment('The first alert threshold for the purchase order');
            $table->timestamp('first_alert_at')->nullable();
            $table->unsignedInteger('second_alert_threshold')->default(90)
                ->comment('The second alert threshold for the purchase order');
            $table->timestamp('second_alert_at')->nullable();
            $table->unsignedInteger('final_alert_threshold')->default(100)
                ->comment('The final alert threshold for the purchase order');
            $table->timestamp('final_alert_at')->nullable();

            $table->index(['org_id', 'client_id']);
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
