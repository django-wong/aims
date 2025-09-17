<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MinimalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            AssignmentTypeSeeder::class,
            UserSeeder::class,
            ProjectTypeSeeder::class,
            SkillSeeder::class,
            CertificateTypeSeeder::class,
            CertificateLevelSeeder::class,
            CertificateTechniqueSeeder::class,
            SecondOrgSeeder::class,
        ]);
    }
}
