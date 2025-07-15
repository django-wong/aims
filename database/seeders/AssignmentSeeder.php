<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\AssignmentType;
use App\Models\Client;
use App\Models\Org;
use App\Models\Project;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AssignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Assignment::factory(50)
            ->recycle(Project::query()->get())
            ->recycle(Client::query()->get())
            ->recycle(AssignmentType::query()->get())
            ->recycle(Org::query()->get())
            ->create();
    }
}
