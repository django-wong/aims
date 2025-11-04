<?php

namespace App\Http\Controllers\APIv1;

use App\Filters\OperatorFilter;
use App\Http\Requests\APIv1\ApproveTimesheetRequest;
use App\Http\Requests\APIv1\RejectTimesheetRequest;
use App\Http\Requests\APIv1\SignOffTimesheetRequest;
use App\Http\Requests\APIv1\UpdateTimesheetRequest;
use App\Models\Timesheet;
use App\Models\UserRole;
use App\Notifications\TimesheetRejected;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Spatie\QueryBuilder\AllowedFilter;

class TimesheetController extends Controller
{
    /**
     * Sign off by inspector for a specific timesheet
     *
     * @param string $id
     * @return array
     */
    public function sign_off(SignOffTimesheetRequest $request, Timesheet $timesheet)
    {
        Gate::authorize('update', $timesheet);

        $status = Timesheet\TimesheetStatus::make($timesheet);

        if ($status->is(Timesheet\Draft::class)) {
            if (empty($timesheet->signed_off_at)) {
                $deadline = Carbon::parse($timesheet->start, $timesheet->assignment->org->timezone)->startOfWeek()->addWeek()->setTime(10, 0);
                if (now($timesheet->assignment->org->timezone)->greaterThan($deadline)) {
                    $timesheet->late = true;
                    activity()->causedByAnonymous()->on($timesheet)->log('Marked as late');
                }
            }

            DB::transaction(function () use ($timesheet, $request) {
                $timesheet->signed_off_at = Carbon::now();
                $timesheet->save();

                foreach ([$timesheet, $timesheet->assignment] as $subject) {
                    activity()
                        ->on($subject)
                        ->withProperties($timesheet->getChanges())->log('Signed off timesheet');
                }
            });

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

        foreach ([$timesheet, $timesheet->assignment] as $subject) {
            activity()
                ->on($subject)
                ->withProperties([
                    'reason' => $request->input('rejection_reason'),
                    'timesheet_id' => $timesheet->id,
                ])
                ->log('Rejected timesheet');
        }

        return [
            'message' => 'You have rejected the timesheet.',
        ];
    }

    protected function allowedIncludes()
    {
        return [
            'user',
            'assignment',
            'assignment.purchase_order',
            'assignment.project',
            'assignment.project.client',
            'timesheet_items',
            'timesheet_items.user'
        ];
    }

    protected function allowedFilters()
    {
        return [
            AllowedFilter::callback('invoice_id', function (Builder $query, $value) {
                if ($value) {
                    $query->whereAny([
                        'client_invoice_id',
                        'contractor_invoice_id'
                    ], $value);
                }
            }),
            AllowedFilter::exact('assignment_id'),
            'hours',
            'travel_distance',
            AllowedFilter::callback('keywords', function (Builder $query, $value) {
                $query->whereIn('assignment_id', function (QueryBuilder $query) use ($value) {
                    $query->select('id')
                        ->from('assignment_details')
                        ->whereAny([
                            'project_title',
                            'client_business_name',
                            'client_code',
                            'purchase_order_title',
                            'purchase_order_previous_title',
                            'skill_code',
                            'main_vendor_name',
                            'sub_vendor_name',
                            'coordinator_name',
                            'operation_coordinator_name'
                        ], 'like', "%$value%");
                });
            }),
            AllowedFilter::custom('status', new OperatorFilter(), 'timesheets.status'),
            AllowedFilter::callback('purchase_order_id', function (Builder $query, $value) {
                $query->whereIn('assignment_id', function (QueryBuilder $query) use ($value) {
                    $query->select('id')
                        ->from('assignments')
                        ->where('purchase_order_id', $value);
                });
            }),
            AllowedFilter::callback('all', function (Builder $query, $value) {
                if ($value !== '1') {
                    $query->whereExists(function ($query) {
                        $query->select(DB::raw(1))
                            ->from('timesheet_items')
                            ->whereRaw('timesheet_items.timesheet_id = timesheets.id and timesheet_items.deleted_at is null');
                    });
                }
            })->default('0'),
            AllowedFilter::callback('project_id', function (Builder $query, $value) {
                if ($value) {
                    $query->whereIn('assignment_id', function (QueryBuilder $query) use ($value) {
                        $query->select('id')
                            ->from('assignments')
                            ->where('project_id', $value);
                    });
                }
            })
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

        $query = $this->getQueryBuilder()->extend()->visible()->defaultSort('-created_at');

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
            )->where('timesheets.status', '>=', Timesheet::APPROVED);
        }

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

        activity()->performedOn($timesheet)
            ->withProperties($timesheet->getChanges())
            ->log(
                'Updated timesheet'
            );

        return [
            'message' => $updated ? 'Timesheet updated successfully.' : 'No changes made to the timesheet.',
            'data' => $timesheet
        ];
    }

    public function destroy(Timesheet $timesheet)
    {
        Gate::authorize('delete', $timesheet);

        return response()->json([
            'data' => $timesheet->delete()
        ]);
    }

    public function approve(ApproveTimesheetRequest $request, Timesheet $timesheet)
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

        foreach ([$timesheet, $timesheet->assignment] as $subject) {
            activity()->on($subject)->withProperties($timesheet->getChanges())->log('Approved timesheet');
        }

        return response()->json([
            'message' => 'You have approved the timesheet.',
            'data' => $timesheet
        ]);
    }

    public function pdf(Timesheet $timesheet)
    {
        $pdf = new \App\PDFs\Timesheet($timesheet);
        $pdf->render();
        return $pdf->Output("timesheet-{$timesheet->id}.pdf", 'I');
    }
}
