<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Controllers\Controller;
use App\Http\Requests\APIv1\TimesheetItems\StoreRequest;
use App\Models\Timesheet;
use App\Models\TimesheetItem;
use Illuminate\Http\Request;

class TimesheetItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        /* @var Timesheet $timesheet */
        $timesheet = $request->assignment()->timesheets()->firstOrCreate();

        $record = $timesheet->timesheet_items()->create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'data' => $record->load('timesheet'),
            'message' => 'Timesheet item created successfully',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(TimesheetItem $timesheetItem)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TimesheetItem $timesheetItem)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TimesheetItem $timesheetItem)
    {
        //
    }
}
