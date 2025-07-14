<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\Timesheet;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TimesheetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Timesheet::factory(20)
            ->recycle(Assignment::query()->get())
            ->create();
    }
}
