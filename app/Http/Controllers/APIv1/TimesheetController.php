<?php

namespace App\Http\Controllers\APIv1;

use App\Filters\OperatorFilter;
use App\Models\Timesheet;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Spatie\QueryBuilder\AllowedFilter;

class TimesheetController extends Controller
{
    public function signOff(string $id)
    {
        $timesheet = Timesheet::query()->with('assignment')->findOrFail($id);

        Gate::authorize('inspect', $timesheet->assignment);

        $status = Timesheet\TimesheetStatuses::make($timesheet);

        if ($status instanceof Timesheet\DraftStatus) {
            $status->next()->transition($timesheet);
        }

        return [
            'message' => 'You have successfully signed off the timesheet.',
            'data' => $timesheet
        ];
    }

    protected function allowedIncludes()
    {
        return [
            'assignment',
            'assignment.project',
            'assignment.project.client',
            'timesheet_items',
            'timesheet_items.user'
        ];
    }

    protected function allowedFilters()
    {
        return [
            AllowedFilter::exact('assignment_id'),
            'hours',
            'travel_distance',
            AllowedFilter::callback('keywords', function (Builder $query, $value) {}),
            AllowedFilter::custom('status', new OperatorFilter())
        ];
    }

    protected function allowedSorts()
    {
        return [
            'id',
            'created_at',
            'hours',
            'start',
            'travel_distance',
        ];
    }

    public function index(Request $request)
    {
        Gate::authorize('viewAny', Timesheet::class);

        return $this->getQueryBuilder()->defaultSort('-created_at')->paginate();
    }


    public function show(Timesheet $timesheet)
    {
        return response()->json([
            'data' => $timesheet->load([
                'assignment', 'assignment.project', 'assignment.project.client', 'timesheet_items', 'timesheet_items.user'
            ])
        ]);
    }

    public function destroy(Timesheet $timesheet)
    {
        return response()->json([
            'data' => $timesheet->delete()
        ]);
    }
}
