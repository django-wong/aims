<?php

namespace Database\Seeders;

use App\Models\InspectorProfile;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InspectorProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach(UserRole::query()->where('role', UserRole::INSPECTOR)->cursor() as $user_role) {
            InspectorProfile::factory()
                ->state([
                    'user_id' => $user_role->user_id,
                ])
                ->create();
        }
    }
}
