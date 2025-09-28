<?php

namespace App\Http\Controllers;

use App\Http\Requests\Timesheets\CaptureRequest;
use App\Models\Timesheet;
use App\Models\TimesheetDetail;
use Illuminate\Http\Request;
use function Aws\filter;

class TimesheetController extends Controller
{
    public function capture(CaptureRequest $request)
    {
        /* @var Timesheet $timesheet */
        $timesheet = $request->assignment()->timesheets()->firstOrCreate();

        $timesheet->timesheet_items()->create([
            ...filter($request->validated(), function ($value) {
                return !is_null($value);
            }),
            'user_id' => $request->user()->id,
        ]);

        // return to_route('timesheets.captured');

        return redirect()->back()->with([
            'message' => 'Timesheet item captured successfully.',
        ]);
    }

    public function captured()
    {
        return inertia('timesheets/captured');
    }

    public function index()
    {
        return inertia('timesheets');
    }

    public function edit(Timesheet $timesheet)
    {
        return inertia('timesheets/edit', [
            'assignment' => $timesheet->assignment,
            'timesheet' => TimesheetDetail::query()->with(['user', 'assignment.coordinator', 'assignment.operation_coordinator'])->find($timesheet->id),
        ]);
    }
}
