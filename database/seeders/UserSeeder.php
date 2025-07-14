<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\Org;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run()
    {
        UserRole::factory()
            ->for(
                User::factory()->create([
                    'email' => 'admin@localhost',
                    'password' => 'Ijd8l@9'
                ])
            )
            ->for(Org::factory()->create())
            ->create();
    }
}
