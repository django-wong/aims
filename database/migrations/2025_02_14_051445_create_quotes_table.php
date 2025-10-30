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
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('org_id')->constrained('orgs');
            $table->string('serial_number')->index();
            $table->string('suffix')->nullable();
            $table->string('title')->storedAs("CONCAT(serial_number, IF(suffix IS NOT NULL AND suffix != '', CONCAT('-', suffix), ''))")->index();
            $table->foreignId('client_id')->nullable()->index()->constrained('clients')->cascadeOnDelete();
            $table->string('client_ref')->nullable();
            $table->string('i_e_a')->default('i');
            $table->text('details')->nullable();
            $table->foreignId('controlling_org_id')->nullable()->constrained('orgs')->cascadeOnDelete();
            $table->date('received_date')->nullable();
            $table->string('pass_to_user')->nullable();
            $table->string('type')->nullable();
            $table->date('due_date')->nullable();
            $table->date('despatched_date')->nullable();
            $table->unsignedTinyInteger('status')->default(0)->comment('0: Won, 1: Lost, 2: Not Advised, 3: Waiting, 4: Declined');
            $table->longText('notes')->nullable();
            $table->foreignId('quote_client_id')->nullable()->constrained('clients')->cascadeOnDelete();
            $table->timestamps();

            $table->index(['org_id', 'client_id', 'quote_client_id', 'status', 'title', 'serial_number'], 'quotes_search_index');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};
