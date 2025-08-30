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
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('certificate_type_id')->nullable();
            $table->foreignId('certificate_technique_id')->nullable();
            $table->string('title');
            $table->morphs('certifiable');
            $table->string('level')->nullable()->comment('Certificate level, e.g., "Beginner", "Intermediate", "Advanced"');
            $table->date('issued_at')->nullable();
            $table->date('expires_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
