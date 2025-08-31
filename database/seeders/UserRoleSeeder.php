<?php

namespace Database\Seeders;

use App\Models\Org;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $org = Org::query()->orderBy('id', 'desc')->first();

        UserRole::factory(2)
            ->recycle($org)
            ->state([
                'role' => UserRole::ADMIN
            ])
            ->create();

        UserRole::factory(2)
            ->recycle($org)
            ->state([
                'role' => UserRole::PM
            ])
            ->create();

        UserRole::factory(2)
            ->recycle($org)
            ->state([
                'role' => UserRole::INSPECTOR
            ])
            ->create();

        UserRole::factory(10)
            ->recycle($org)
            ->state([
                'role' => UserRole::STAFF
            ])
            ->create();


        UserRole::factory(10)
            ->recycle($org)
            ->state([
                'role' => UserRole::CLIENT
            ])
            ->create();

        $this->call([InspectorProfileSeeder::class]);
    }
}
