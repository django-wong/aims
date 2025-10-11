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
                    $subQuery->select('id')->from('timesheets')->where('assignment_id', $value);
                });
            }),
            AllowedFilter::callback('timesheet_id', function (Builder $query, $value) {
                $query->where('timesheet_id', $value);
            }),
        ];
    }

    protected function allowedIncludes()
    {
        return [
            'attachments', 'attachments_count'
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
     *
     * @throws \Throwable
     */
    public function store(StoreRequest $request)
    {
        /**
         * @var \App\Models\AssignmentInspector|null $assignment_inspector
         */
        $assignment_inspector = $request->timesheet()->assignment->assignment_inspectors()
            ->firstWhere(
                'user_id', $request->timesheet()->user_id
            );

        if (empty($assignment_inspector)) {
            return response()->json([
                'message' => 'User is not an inspector on this assignment',
            ], 422);
        }

        if (empty($assignment_inspector->hourly_rate) || empty($assignment_inspector->travel_rate)) {
            return response()->json([
                'message' =>
                    'The purchase order does not have hourly and/or travel rate set',
            ], 422);
        }

        if (empty($assignment_inspector->user->inspector_profile->hourly_rate) || empty($assignment_inspector->user->inspector_profile->travel_rate)) {
            return response()->json([
                'message' =>
                    'The inspector does not have hourly and/or travel rate set in their profile',
            ], 422);

        }

        $dates = $request->validated('dates', [$request->validated('date')]);

        $data = [
            ...array_filter($request->validated(), function ($value) {
                return $value !== null;
            }),
            'hourly_rate' => $assignment_inspector->hourly_rate,
            'travel_rate' => $assignment_inspector->travel_rate,
            'pay_rate' => $assignment_inspector->user->inspector_profile->hourly_rate,
            'pay_travel_rate' => $assignment_inspector->user->inspector_profile->travel_rate,
        ];

        $record = DB::transaction(function () use ($request, $assignment_inspector, $dates, $data) {
            for ($i = 0; $i < count($dates); $i++) {
                $date = $dates[$i];

                $record = $request->timesheet()->timesheet_items()->updateOrCreate([
                    'user_id' => $assignment_inspector->user_id,
                    'date' => $date,
                ], $data);

                if ($i === 0) {
                    $request->saveAttachments($record);
                }

                foreach ([$request->timesheet(), $request->timesheet()->assignment] as $subject) {
                    activity()
                        ->on($subject)
                        ->withProperties($record->getAttributes())
                        ->log('Logged time');
                }
            }

            return $record;
        });


        return [
            'message' => 'Timesheet item created successfully',
            'data' => $record->load([
                'timesheet',
                'attachments'
            ]),
        ];
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
        DB::transaction(function () use ($request, $timesheet_item) {
            $timesheet_item->update($request->validated());

            activity()
                ->on($timesheet_item->timesheet)
                ->withProperties([
                    ...$timesheet_item->getChanges(),
                    'date' => $timesheet_item->date,
                ])
                ->log('Updated timesheet item');

            $request->saveAttachments($timesheet_item);
        });

        return [
            'message' => 'Timesheet item updated successfully',
            'data' => $timesheet_item
                ->refresh()
                ->load([
                    'attachments'
                ])
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TimesheetItem $timesheet_item)
    {
        $timesheet_item->delete();

        activity()->performedOn($timesheet_item->timesheet)->withProperties($timesheet_item->getAttributes())->log('Deleted timesheet item');

        return response()->json([
            'message' => 'Timesheet item deleted successfully',
        ]);
    }
}
