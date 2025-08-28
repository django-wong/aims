<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\AssignmentType;
use App\Models\Client;
use App\Models\Org;
use App\Models\Project;
use App\Models\User;
use App\Models\UserRole;
use App\Models\Vendor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AssignmentSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /**
         * @var Project $project
         */
        foreach (Project::query()->get() as $project) {
            Assignment::factory(1)
                ->recycle(AssignmentType::query()->get())
                ->recycle($project)
                ->recycle($project->org)
                ->recycle($project->purchase_orders)
                ->state([
                    // 'inspector_id' => User::query()->whereHas('user_role', function ($query) use ($project) {
                    //     $query->where('role', UserRole::INSPECTOR)
                    //         ->where('org_id', $project->org_id);
                    // })->inRandomOrder()->first()->id,
                ])
                ->create();
        }
    }
}
