<?php

namespace Database\Seeders;

use App\Models\Timesheet;
use App\Models\TimesheetItem;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TimesheetItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TimesheetItem::factory(100)
            ->recycle(Timesheet::query()->get())
            ->create();
    }
}
