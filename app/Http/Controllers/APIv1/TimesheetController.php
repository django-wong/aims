<?php

namespace App\Http\Controllers\APIv1;

use App\Filters\OperatorFilter;
use App\Http\Requests\APIv1\RejectTimesheetRequest;
use App\Http\Requests\APIv1\UpdateTimesheetRequest;
use App\Models\Timesheet;
use App\Models\UserRole;
use App\Notifications\TimesheetRejected;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Spatie\QueryBuilder\AllowedFilter;

class TimesheetController extends Controller
{
    /**
     * Sign off by inspector for a specific timesheet
     * @param string $id
     * @return array
     */
    public function sign_off(Timesheet $timesheet)
    {
        Gate::authorize('update', $timesheet);

        $status = Timesheet\TimesheetStatus::make($timesheet);

        if ($status->is(Timesheet\Draft::class)) {
            if (empty($timesheet->signed_off_at)) {
                $deadline = Carbon::parse($timesheet->start, $timesheet->assignment->org->timezone)->startOfWeek()->addWeek()->setTime(10, 0);
                if (now($timesheet->assignment->org->timezone)->greaterThan($deadline)) {
                    $timesheet->late = true;
                }
            }
            $timesheet->signed_off_at = Carbon::now();
            $timesheet->save();

            $status->next()?->transition($timesheet);
        }

        return [
            'message' => 'You have successfully signed off the timesheet.',
            'data' => $timesheet
        ];
    }

    public function reject(Timesheet $timesheet, RejectTimesheetRequest $request)
    {
        $timesheet->reject($request->input('rejection_reason'));

        $timesheet->user->notify(new TimesheetRejected($timesheet));

        return [
            'message' => 'You have rejected the timesheet.',
        ];
    }

    protected function allowedIncludes()
    {
        return [
            'user',
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
            AllowedFilter::custom('status', new OperatorFilter(), 'timesheets.status')
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

        $query = $this->getQueryBuilder()->visible()->defaultSort('-created_at');

        if (auth()->user()->isRole(UserRole::CLIENT)) {
            $query->whereIn(
                'timesheets.id', function ($q) {
                    $q->select('timesheets.id')
                        ->from('timesheets')
                        ->join('assignments', 'timesheets.assignment_id', '=', 'assignments.id')
                        ->join('projects', 'assignments.project_id', '=', 'projects.id')
                        ->where(
                            'projects.client_id', auth()->user()->client->id
                        );
                }
            )->where('timesheets.status', '>', Timesheet::APPROVED);
        }

        $query
            ->leftJoin('users', 'timesheets.user_id', '=', 'users.id')
            ->leftJoin('assignments', 'timesheets.assignment_id', '=', 'assignments.id')
            ->leftJoin('purchase_orders', 'assignments.purchase_order_id', '=', 'purchase_orders.id')
            ->leftJoin('vendors as sub_vendor', 'sub_vendor.id', '=', 'assignments.sub_vendor_id')
            ->leftJoin('vendors as main_vendor', 'main_vendor.id', '=', 'assignments.vendor_id');

        $query->select('timesheets.*', 'purchase_orders.mileage_unit', 'purchase_orders.currency', 'users.name as inspector_name');

        return $query->paginate();
    }


    public function show(Timesheet $timesheet)
    {
        return response()->json([
            'data' => $timesheet->load([
                'assignment', 'assignment.project', 'assignment.project.client', 'timesheet_items', 'timesheet_items.user'
            ])
        ]);
    }

    public function update(UpdateTimesheetRequest $request, Timesheet $timesheet)
    {
        $updated = $timesheet->update($request->input());

        return [
            'message' => $updated ? 'Timesheet updated successfully.' : 'No changes made to the timesheet.',
            'data' => $timesheet
        ];
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

        start:
        $status = Timesheet\TimesheetStatus::make($timesheet);

        if ($status->is(Timesheet\Draft::class)) {
            $status->next()->transition($timesheet);
            goto start;
        }

        $next = $status->next();

        $next?->transition($timesheet);

        return response()->json([
            'message' => 'You have approved the timesheet.',
            'data' => $timesheet
        ]);
    }
}
