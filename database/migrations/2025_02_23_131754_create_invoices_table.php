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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('org_id')->constrained();
            $table->string('invoice_number')->nullable();
            $table->foreignId('purchase_order_id')->constrained();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete(); // The user that created the invoice
            $table->uuid('batch_id')->nullable()->index()->comment('Used when creating multiple invoices in a batch, e.g. from timesheets');
            $table->morphs('invoiceable'); // If the morph model is client, then this is a domestic job that is done by the contractor holder office directly for the client.
            $table->longText('signature_base64')->nullable()->comment('Base64 encoded signature image');
            $table->text('rejection_reason')->nullable();
            $table->unsignedTinyInteger('status')->default(0)->comment('0 = draft, 1 = sent, others are reserved for future use');
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('reminder_sent_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
