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
            CREATE OR REPLACE VIEW inspector_skill_matrices AS
            select
                inspector_profiles.id,
                inspector_profiles.user_id,
                user_roles.org_id,
                users.name as inspector_name,
                addresses.country as country,
                addresses.state as state,
                addresses.city as city,
                skills.id as skill_id,
                skills.i_e_a as i_e_a,
                skills.code as skill_code,
                skills.description as skill_description
            from inspector_profiles
            left join users on inspector_profiles.user_id = users.id
            left join addresses on inspector_profiles.address_id = addresses.id
            left join user_skills on users.id = user_skills.user_id
            left join skills on user_skills.skill_id = skills.id
            left join user_roles on users.id = user_roles.user_id
            where inspector_profiles.include_on_skills_matrix = 1
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::unprepared("DROP VIEW IF EXISTS inspector_skill_matrices");
    }
};
