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
        Schema::table('invoices', function (Blueprint $table) {
            $table->after('batch_id', function (Blueprint $table) {
                $table->string('title')->nullable();
                $table->string('sub_title')->nullable();
                $table->string('billing_name')->nullable();
                $table->string('billing_address')->nullable();
                $table->text('notes')->nullable();
            });
        });

        $view = include database_path('migrations/2025_09_22_085547_create_invoice_details_view.php');
        $view->up();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['title', 'sub_title', 'notes', 'billing_name', 'billing_address']);
        });

        $view = include database_path('migrations/2025_09_22_085547_create_invoice_details_view.php');
        $view->up();
    }
};
