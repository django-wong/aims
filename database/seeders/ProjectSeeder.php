<?php

namespace Database\Seeders;

use App\Models\Org;
use App\Models\Project;
use App\Models\ProjectType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Project::factory(100)
            ->recycle(ProjectType::query()->get())
            ->recycle(Org::query()->get())
            ->create();
    }
}
