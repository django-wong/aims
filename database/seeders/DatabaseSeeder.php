<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\AssignmentType;
use App\Models\Project;
use App\Models\ProjectType;
use App\Models\Timesheet;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
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
