<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\TimesheetItems\StoreRequest;
use App\Models\Assignment;
use App\Models\Timesheet;
use App\Models\TimesheetItem;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Spatie\QueryBuilder\AllowedFilter;

class TimesheetItemController extends Controller
{
    public function allowedFilters()
    {
        return [
            AllowedFilter::callback('assignment_id', function (Builder $query, $value) {
                $assignment = Assignment::query()->findOrFail($value);
                Gate::authorize('view', $assignment);
                $query->whereIn('timesheet_id', function ($subQuery) use ($value) {
                    $subQuery->select('id')
                        ->from('timesheets')
                        ->where('assignment_id', $value);
                });
            })->default(0),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return $this->getQueryBuilder()->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        /* @var Timesheet $timesheet */
        $timesheet = $request->assignment()->timesheets()->firstOrCreate();

        $record = DB::transaction(function () use ($request, $timesheet) {
            $record = $timesheet->timesheet_items()->create([
                ...array_filter($request->validated(), function ($value) {
                    return $value !== null;
                }),
                'user_id' => $request->user()->id,
            ]);

            $request->saveAttachments($record);

            return $record;
        });

        return response()->json([
            'data' => $record->load(['timesheet', 'attachments']),
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
