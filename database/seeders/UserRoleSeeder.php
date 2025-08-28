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
        UserRole::factory(2)
            ->recycle(Org::query()->get())
            ->state([
                'role' => UserRole::ADMIN
            ])
            ->create();

        UserRole::factory(2)
            ->recycle(Org::query()->get())
            ->state([
                'role' => UserRole::PM
            ])
            ->create();

        UserRole::factory(2)
            ->recycle(Org::query()->get())
            ->state([
                'role' => UserRole::INSPECTOR
            ])
            ->create();

        UserRole::factory(10)
            ->recycle(Org::query()->get())
            ->state([
                'role' => UserRole::STAFF
            ])
            ->create();


        UserRole::factory(10)
            ->recycle(Org::query()->get())
            ->state([
                'role' => UserRole::CLIENT
            ])
            ->create();

        $this->call([InspectorProfileSeeder::class]);
    }
}
