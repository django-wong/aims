<?php

namespace App\Http\Controllers;

use App\Http\Requests\Timesheets\CaptureRequest;
use App\Models\Timesheet;
use Illuminate\Http\Request;

class TimesheetController extends Controller
{
    public function capture(CaptureRequest $request)
    {
        /* @var Timesheet $timesheet */
        $timesheet = $request->assignment()->timesheets()->firstOrCreate();

        $timesheet->timesheet_items()->create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return to_route('timesheets.captured');
    }

    public function captured()
    {
        return inertia('timesheets/captured');
    }
}
