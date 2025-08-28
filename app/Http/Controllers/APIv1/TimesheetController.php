<?php

namespace App\Http\Controllers\APIv1;

use App\Filters\OperatorFilter;
use App\Models\Timesheet;
use App\Models\UserRole;
use Carbon\Carbon;
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

        $status = Timesheet\TimesheetStatus::make($timesheet);

        if ($status->is(Timesheet\Draft::class)) {
            $timesheet->signed_off_at = Carbon::now();
            $status->next()
                ?->transition($timesheet);
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
        return $this->getQueryBuilder()->tap(function (Builder $query) {
            if (auth()->user()->isRole(UserRole::CLIENT)) {
                $query->whereIn(
                    'id', function ($q) {
                        $q->select('timesheets.id')
                            ->from('timesheets')
                            ->join('assignments', 'timesheets.assignment_id', '=', 'assignments.id')
                            ->join('projects', 'assignments.project_id', '=', 'projects.id')
                            ->where('projects.client_id', auth()->user()->client->id);
                    }
                );
            }
        })->defaultSort('-created_at')->paginate();
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

    public function approve(Timesheet $timesheet)
    {
        Gate::authorize('approve', $timesheet);

        $status = Timesheet\TimesheetStatus::make($timesheet);

        $next = $status->next();

        $next?->transition($timesheet);

        return response()->json([
            'message' => 'You have approved the timesheet.',
            'data' => $timesheet
        ]);
    }
}
