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
        Schema::table('orgs', function (Blueprint $table) {
            $table->after('code', function (Blueprint $table) {
                $table->string('abn')->nullable();
                $table->string('billing_name')->nullable();
                $table->string('billing_address')->nullable();
                $table->text('billing_statement')->nullable();
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orgs', function (Blueprint $table) {
            $table->dropColumn('billing_statement');
            $table->dropColumn('billing_address');
            $table->dropColumn('billing_name');
            $table->dropColumn('abn');
        });
    }
};
