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
        Schema::create('inspector_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->index()->constrained('users')->onDelete('cascade');
            $table->foreignId('address_id')->nullable()->constrained('addresses')->onDelete('set null');
            $table->string('initials')->nullable();
            $table->decimal('hourly_rate')->default(0);
            $table->decimal('travel_rate')->default(0);
            $table->decimal('new_hourly_rate')->nullable();
            $table->decimal('new_travel_rate')->nullable();
            $table->date('new_rate_effective_date')->nullable();
            $table->string('assigned_identifier')->nullable();
            $table->boolean('include_on_skills_matrix')->default(true);
            $table->longText('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspector_profiles');
    }
};
