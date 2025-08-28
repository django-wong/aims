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
        Schema::create('assignment_inspectors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('assignment_type_id')->constrained()->onDelete('cascade');

            $table->timestamp('acked_at')->nullable();
            $table->longText('signature_base64')->nullable();

            // Copy on write from budgets table
            $table->decimal('hourly_rate', 10);
            $table->decimal('travel_rate', 10)->default(0.5);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assignment_inspectors');
    }
};
