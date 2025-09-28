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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->string('address_line_1')->nullable()->comment('Apartment, suite, unit, building, floor, etc.');
            $table->string('address_line_2')->nullable()->comment('Street address, P.O. box, company name, c/o');
            $table->string('address_line_3')->nullable()->comment('Street address, P.O. box, company name, c/o');
            $table->string('suburb')->nullable()->comment('Suburb, district, or neighborhood like Brooklyn, Soho, 金水区 etc.');
            $table->string('city')->nullable()->comment('City like New York, London, 成都市 etc.');
            $table->string('state')->nullable()->comment('State, province, or region like California, Ontario, Henan etc.');
            $table->string('zip')->nullable()->comment('Postal code or ZIP code');
            $table->string('country')->nullable();
            $table->string('full_address')->storedAs(
                "TRIM(CONCAT_WS(', ', address_line_1, address_line_2, address_line_3, suburb, city, state, zip, country))"
            );
            $table->float('latitude', 10, 6)->nullable();
            $table->float('longitude', 10, 6)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
