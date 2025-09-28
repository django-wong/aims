<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\AssignmentInspector;
use App\Models\Timesheet;
use Carbon\WeekDay;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TimesheetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $from = now()->subMonths(3);
        $to = now();


        while ($from->lessThan($to)) {
            foreach (AssignmentInspector::query()->cursor() as $inspector) {
                Timesheet::factory()
                    ->state([
                        'start' => $from->startOfWeek(WeekDay::Monday)->format('Y-m-d'),
                        'end' => $from->endOfWeek(WeekDay::Sunday)->format('Y-m-d'),
                        'assignment_id' => $inspector->assignment_id,
                        'user_id' => $inspector->user_id,
                    ])
                    ->create();
            }
            $from = $from->addWeek();
        }
    }
}
