<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            'Drilling',
            'FPSO',
            'LNG',
            'Mining',
            'Offshore',
            'Onshore',
            'Power Generation',
            'Renewables',
        ];

        foreach ($types as $type) {
            \App\Models\ProjectType::query()->create(['name' => $type]);
        }
    }
}
