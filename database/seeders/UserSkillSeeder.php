<?php

namespace Database\Seeders;

use App\Models\Skill;
use App\Models\User;
use App\Models\UserSkill;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        UserSkill::factory()
            ->recycle(
                User::query()->inspectors()->get()
            )
            ->recycle(
                Skill::query()->inRandomOrder()->get()
            )
            ->count(30)
            ->create();
    }
}
