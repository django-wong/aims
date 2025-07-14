<?php

namespace Database\Seeders;

use App\Models\AssignmentType;
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
        AssignmentType::query()->insert([
            ['name' => 'Inspection'],
            ['name' => 'Maintenance'],
            ['name' => 'Repair'],
            ['name' => 'Installation'],
            ['name' => 'Consultation'],
        ]);
    }
}
