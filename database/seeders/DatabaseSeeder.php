<?php

namespace Database\Seeders;

use App\Models\Assignment;
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
            UserSeeder::class,
            UserRoleSeeder::class,
            ClientSeeder::class,
            ProjectTypeSeeder::class,
            ProjectSeeder::class,
            VendorSeeder::class,
            AssignmentSeeder::class,
            TimesheetSeeder::class,
            TimesheetItemSeeder::class
        ]);
    }
}
