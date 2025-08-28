<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\TimesheetItems\StoreRequest;
use App\Http\Requests\APIv1\TimesheetItems\UpdateRequest;
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
            }),
            AllowedFilter::callback('timesheet_id', function (Builder $query, $value) {
                Gate::authorize('view', Timesheet::query()->findOrFail($value));
                $query->where('timesheet_id', $value);
            }),
        ];
    }

    public function allowedSorts()
    {
        return [
            'date', 'created_at', 'updated_at'
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $request->validate([
            'filter.timesheet_id' => 'required_without:filter.assignment_id',
            'filter.assignment_id' => 'required_without:filter.timesheet_id',
        ]);
        return $this->getQueryBuilder()->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $po = $request->timesheet()->assignment->purchase_order;
        $budget = $po->budgets()->where('assignment_type_id', $request->timesheet()->assignment->assignment_type_id)->first();

        if (empty($budget)) {
            return response()->json([
                'message' => 'No budget found for this assignment type in the associated purchase order. Contact the coordinator to fix this issue.'
            ], 422);
        }

        $record = DB::transaction(function () use ($request, $budget) {
            $record = $request->timesheet()->timesheet_items()->create([
                ...array_filter($request->validated(), function ($value) {
                    return $value !== null;
                }),
                'user_id' => $request->assignment()->inspector_id,
                'hourly_rate' => $budget->hourly_rate,
                'travel_rate' => $budget->travel_rate,
            ]);

            $request->saveAttachments($record);

            return $record;
        });

        return response()->json([
            'message' => 'Timesheet item created successfully',
            'data' => $record->load([
                'timesheet',
                'attachments'
            ]),
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
    public function update(UpdateRequest $request, TimesheetItem $timesheet_item)
    {
        $updated = $timesheet_item->update(
            $request->validated()
        );

        return [
            'message' => $updated ? 'Timesheet item updated successfully' : 'No changes made',
            'data' => $timesheet_item->refresh()->load(['attachments'])
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TimesheetItem $timesheetItem)
    {
        //
    }
}
