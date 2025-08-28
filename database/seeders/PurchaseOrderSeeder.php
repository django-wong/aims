<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PurchaseOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a purchase order for each project
        foreach (\App\Models\Project::all() as $project) {
            \App\Models\PurchaseOrder::factory()
                ->recycle($project)
                ->recycle($project->org)
                ->create();
        }
    }
}
