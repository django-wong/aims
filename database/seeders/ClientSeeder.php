<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Org;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (UserRole::query()->where('role', UserRole::CLIENT)->cursor() as $entity) {
            Client::factory()
                ->state([
                    'user_id' => $entity->user_id,
                    'org_id' => $entity->org_id
                ])
                ->create();
        }
    }
}
