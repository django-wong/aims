<?php

test('hours stored as work_hours + travel_hours + report_hours', function () {
    $item = \App\Models\TimesheetItem::factory()->create([
        'work_hours' => 5,
        'travel_hours' => 2,
        'report_hours' => 1,
        'travel_distance' => 50,
    ]);

    $item->refresh();

    expect($item->hours)->toBe(8);

    expect($item->timesheet)->toBeInstanceOf(\App\Models\Timesheet::class);

    expect($item->timesheet->hours)->toBe(8);

    expect($item->timesheet->travel_distance)->toBe(50);
});
