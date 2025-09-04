<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Project;
use App\Models\ProjectType;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (Client::query()->cursor() as $client) {
            Project::factory(2)
                ->recycle(ProjectType::query()->get())
                ->recycle($client->org)
                ->recycle($client)
                ->create();
        }
    }
}
