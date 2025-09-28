<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Laravel\Telescope\Telescope;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Telescope::stopRecording();
        $this->call([
            AssignmentTypeSeeder::class,
            UserSeeder::class,
            UserRoleSeeder::class,
            ClientSeeder::class,
            ProjectTypeSeeder::class,
            ProjectSeeder::class,
            PurchaseOrderSeeder::class,
            BudgetSeeder::class,
            VendorSeeder::class,
            AssignmentSeeder::class,
            AssignmentInspectorSeeder::class,
            TimesheetSeeder::class,
            TimesheetItemSeeder::class,
            ContactSeeder::class,
            SkillSeeder::class,
            CertificateTypeSeeder::class,
            CertificateLevelSeeder::class,
            CertificateTechniqueSeeder::class,
            SecondOrgSeeder::class,
        ]);
    }
}
