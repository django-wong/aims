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
        UserRole::factory(200)
            ->recycle(Org::query()->get())
            ->create();
    }
}
