<?php

namespace Database\Seeders;

use App\Models\Timesheet;
use App\Models\TimesheetItem;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Database\Seeder;

class TimesheetItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = Timesheet::query()
            ->leftJoin('assignment_inspectors', function (JoinClause $query) {
                $query->on('timesheets.assignment_id', '=', 'assignment_inspectors.assignment_id')
                    ->on('timesheets.user_id', '=', 'assignment_inspectors.user_id');
            })
            ->select([
                'timesheets.*',
                'assignment_inspectors.hourly_rate as hourly_rate',
                'assignment_inspectors.travel_rate as travel_rate',
            ])
            ->cursor();

        foreach ($data as $timesheet) {
            $start = $timesheet->start->copy();
            $end = $timesheet->end;
            while ($start->lessThan($end)) {
                TimesheetItem::factory()
                    ->state([
                        'timesheet_id' => $timesheet->id,
                        'user_id' => $timesheet->user_id,
                        'date' => $start->toDateString(),
                        'hourly_rate' => $timesheet->hourly_rate,
                        'travel_rate' => $timesheet->travel_rate,
                    ])
                    ->create();
                $start = $start->addDay();
            }
        }
    }
}
