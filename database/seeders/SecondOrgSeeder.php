<?php

namespace Database\Seeders;

use App\Models\Org;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Seeder;

class SecondOrgSeeder extends Seeder
{
    public function run()
    {
        $org = Org::factory()->create();

        UserRole::factory()
            ->for(
                User::factory()->create([
                    'email' => 'admin2@localhost',
                    'password' => 'Ijd8l@9'
                ])
            )
            ->state([
                'role' => UserRole::ADMIN,
                'org_id' => $org->id
            ])
            ->create();

        $this->call(UserRoleSeeder::class);
    }
}
