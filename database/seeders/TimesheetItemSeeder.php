<?php

namespace Database\Seeders;

use App\Models\Timesheet;
use App\Models\TimesheetItem;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TimesheetItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TimesheetItem::factory(50)
            ->recycle(User::query()->get())
            ->recycle(Timesheet::query()->get())
            ->create();
    }
}
