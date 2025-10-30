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
        \Illuminate\Support\Facades\DB::unprepared("
            CREATE OR REPLACE VIEW quote_details AS
            select
                quotes.*,
                client.business_name as client_business_name,
                quote_client.business_name as quote_client_business_name,
                org.name as org_name,
                controlling_org.name as controlling_org_name
            from quotes
            left join clients as client on quotes.client_id = client.id
            left join clients as quote_client on quotes.quote_client_id = quote_client.id
            left join orgs as org on quotes.org_id = org.id
            left join orgs as controlling_org on quotes.controlling_org_id = controlling_org.id;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::unprepared(
            "DROP VIEW IF EXISTS quote_details;"
        );
    }
};
