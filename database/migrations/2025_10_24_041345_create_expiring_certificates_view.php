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
            CREATE OR REPLACE VIEW expiring_certificates AS
            select
                certificates.*,
                users.name as user_full_name,
                user_roles.org_id,
                certificate_types.name as certificate_type_name,
                certificate_techniques.name as certificate_technique_name,
                certificate_levels.name as certificate_level_name,
                datediff(expires_at, now())  as expiring_in_days
            from certificates
            left join certificate_types on certificates.certificate_type_id = certificate_types.id
            left join users on certificates.user_id = users.id
            left join certificate_techniques on certificates.certificate_technique_id =certificate_techniques.id
            left join certificate_levels on certificates.certificate_level_id =certificate_levels.id
            left join user_roles on user_roles.user_id = certificates.user_id
            where expires_at is not null and datediff(expires_at, now()) <= 30;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::unprepared("
            DROP VIEW IF EXISTS expiring_certificates;
        ");
    }
};
