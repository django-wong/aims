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
        Schema::create('attachment_revisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attachment_id')->constrained()->onDelete('cascade');
            $table->string('name')->index();
            $table->string('mime_type')->nullable()->comment('MIME type of the file, e.g., image/jpeg, application/pdf');
            $table->string('path');
            $table->string('disk')->default('local');
            $table->unsignedBigInteger('size')->nullable()->comment('File size in bytes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attachment_revisions');
    }
};
