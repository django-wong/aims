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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('business_name')->index()->comment('The name of the client business or organization');
            $table->text('logo_url')->nullable()->comment('URL to the client\'s logo image');
            $table->foreignId('org_id')->index()->constrained();
            $table->foreignId('user_id')->index()->constrained()->comment('Each client is associated with a user account, which can be used to log in to the system');
            $table->foreignId('coordinator_id')->nullable()->index()->constrained('users');
            $table->foreignId('reviewer_id')->nullable()->index()->constrained('users');
            $table->foreignId('address_id')->nullable()->constrained();
            $table->tinyInteger('invoice_reminder')->default(7)->comment('Days before the invoice is due to send a first notice');
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
        Schema::dropIfExists('clients');
    }
};
