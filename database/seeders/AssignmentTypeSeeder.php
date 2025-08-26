<?php

namespace Database\Seeders;

use App\Models\AssignmentType;
use Illuminate\Database\Seeder;

class AssignmentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AssignmentType::query()->insert([
            ['org_id' => null, 'name' => 'Inspection'],
            ['org_id' => null, 'name' => 'Maintenance'],
            ['org_id' => null, 'name' => 'Repair'],
            ['org_id' => null, 'name' => 'Installation'],
            ['org_id' => null, 'name' => 'Consultation'],
        ]);
    }
}
