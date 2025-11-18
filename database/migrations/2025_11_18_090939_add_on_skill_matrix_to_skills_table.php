<?php

use App\Models\Skill;
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
        Schema::table('skills', function (Blueprint $table) {
            $table->json('on_skill_matrix')->nullable()->after('sort');
        });

        // Set default value for existing records
        Skill::query()->where('skills.i_e_a', 'I')->update(['on_skill_matrix' => ['inspection', 'specialist']]);
        Skill::query()->where('skills.i_e_a', 'E')->update(['on_skill_matrix' => ['expedition']]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('skills', function (Blueprint $table) {
            $table->dropColumn('on_skill_matrix');
        });
    }
};
