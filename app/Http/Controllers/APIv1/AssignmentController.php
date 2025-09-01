<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\Assignments\SignOffRequest;
use App\Http\Requests\APIv1\Assignments\StoreRequest;
use App\Http\Requests\APIv1\Assignments\UpdateRequest;
use App\Http\Requests\APIv1\DeleteAssignmentRequest;
use App\Http\Requests\APIv1\RejectAssignmentRequest;
use App\Models\Assignment;
use App\Models\Comment;
use App\Models\Org;
use App\Models\Project;
use App\Models\Timesheet;
use App\Models\TimesheetItem;
use App\Models\TimesheetReport;
use App\Notifications\NewAssignmentDelegated;
use App\Notifications\NewAssignmentIssued;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use PhpParser\Node\Expr\Assign;
use Spatie\QueryBuilder\AllowedFilter;
use Barryvdh\DomPDF\Facade\Pdf;

class AssignmentController extends Controller
{

    // public function link(Assignment $assignment)
    // {
    //     Gate::authorize('update', $assignment);
    //
    //     return [
    //         'data' => URL::signedRoute(
    //             'assignments.record-timesheet', [
    //                 'id' => $assignment->id,
    //                 'user' => $assignment->inspector_id,
    //             ]
    //         )
    //     ];
    // }

    public function reject(RejectAssignmentRequest $request, Assignment $assignment)
    {
        Comment::quick($request->validated('message'), for: $assignment);

        $assignment->update([
            'status' => Assignment::REJECTED,
        ]);

        return [
            'message' => 'You have rejected the assignment.',
        ];
    }

    public function send(Assignment $assignment)
    {
        if (empty($assignment->operation_coordinator)) {
            return response()->json([
                'message' => 'Please assign an operation coordinator before sending the assignment to operation office.',
            ], 422);
        }

        $assignment->status = Assignment::ISSUED;
        $assignment->save();

        $assignment->operation_coordinator?->notify(
            new NewAssignmentDelegated($assignment)
        );

        return [
            'message' => 'Assignment sent to operation office successfully.',
        ];
    }

    public function accept(Assignment $assignment)
    {
        $assignment->status = Assignment::ACCEPTED;
        $assignment->save();

        return [
            'message' => 'You have accepted the assignment.',
        ];
    }

    protected function allowedIncludes()
    {
        return [
            'project', 'assignment_type', 'vendor', 'sub_vendor', 'operation_org', 'org', 'purchase_order', 'project.client', 'project.project_type', 'skill'
        ];
    }

    protected function allowedSorts()
    {
        return [
            'created_at'
        ];
    }

    public function allowedFilters()
    {
        return [
            AllowedFilter::exact('project_id'),
            AllowedFilter::callback('client_id', function ($query, $value) {
                $query->whereHas('project', function ($query) use ($value) {
                    $query->where('client_id', $value);
                });
            }),
            AllowedFilter::callback('group', function (Builder $query, $value) {
                match ($value) {
                    'delegated' => $query->where('delegated', true),
                    default => null,
                };
            })
        ];
    }

    public function notify(string $id)
    {
        $assignment = Assignment::query()->findOrFail($id);

        Gate::allows('update', $assignment);

        $assignment->assignment_inspectors()->each(function ($inspector) use ($assignment) {
            $inspector->notify(
                new NewAssignmentIssued($assignment)
            );
        });

        return response()->json([
            'message' => 'Inspector notified successfully.',
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', [Assignment::class]);

        return $this->getQueryBuilder()->tap(function (Builder $query) {
            if (auth()->user()->isRole(\App\Models\UserRole::CLIENT)) {
                $query->whereHas('project', function ($query) {
                    $query->where('client_id', auth()->user()->client?->id);
                });
            }
        })->visible()->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        Gate::authorize('create', [Assignment::class, Org::current()]);

        $data = $request->validated();

        // if ($request->validated('operation_org_id')) {
        //     $data['status'] = Assignment::ISSUED;
        // } else {
        //     $data['status'] = Assignment::DRAFT;
        // }

        $assignment = Org::current()->assignments()->create($data);

        $request->saveAttachments(for: $assignment);

        return response()->json([
            'data' => $assignment->load(
                'project', 'assignment_type', 'vendor', 'sub_vendor', 'operation_org'
            ),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Assignment $assignment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Assignment $assignment)
    {
        $assignment->update($request->validated());

        $request->saveAttachments(for: $assignment);

        return [
            'message' => 'Assignment updated successfully.',
            'data' => $assignment->load(
                'project', 'assignment_type', 'vendor', 'sub_vendor', 'operation_org'
            ),
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeleteAssignmentRequest $request, Assignment $assignment)
    {
        $assignment->delete();

        return [
            'message' => 'Assignment deleted successfully.',
        ];
    }

    public function pdf(Assignment $assignment)
    {
        return Pdf::loadView('pdfs.assignment-form', ['assignment' => $assignment])->download("assignment-{$assignment->id}.pdf");
    }

    public function daily_usage(Request $request, Assignment $assignment)
    {
        $validated = $request->validate([
            'range' => 'required|in:-7 days,-30 days,-90 days',
        ]);

        $start = (new \DateTime())->modify($validated['range']);
        $end = new \DateTime();

        $data_by_date = [];

        $timesheet_items = TimesheetItem::query()->whereBetween('date', [$start->format('Y-m-d'), $end->format('Y-m-d')])
            ->select([
                'date',
                \DB::raw('SUM(work_hours) as work'),
                \DB::raw('SUM(travel_hours) as travel'),
                \DB::raw('SUM(report_hours) as remote'),
            ])
            ->whereIn('timesheet_id', function (QueryBuilder  $query) use ($assignment) {
                $query->select('id')
                    ->from('timesheets')
                    ->where('status', '>', Timesheet::DRAFT)
                    ->where('assignment_id', $assignment->id);
            })
            ->groupBy('date')
            ->get();

        foreach ($timesheet_items as $item) {
            $data_by_date[$item->date->format('Y-m-d')] = [
                'work' => (int)$item->work,
                'travel' => (int)$item->travel,
                'remote' => (int)$item->remote,
            ];
        }

        while ($start <= $end) {
            if (empty($data_by_date[$start->format('Y-m-d')])) {
                $data_by_date[$start->format('Y-m-d')] = [
                    'work' => 0, 'travel' => 0, 'remote' => 0,
                ];
            }
            $start->modify('+1 day');
        }

        ksort($data_by_date);

        $usage = [];

        foreach ($data_by_date as $date => $data) {
            $data['date'] = $date;
            $usage[] = $data;
        }

        return ['data' => $usage];
    }

    public function next_assignment_number()
    {
        Gate::authorize('viewAny', Project::class);

        return response()->json([
            'data' => Assignment::nextAssignmentNumber(),
            'message' => 'Next assignment number retrieved successfully.',
        ]);
    }

    public function timesheet_reports(Assignment $assignment)
    {
        Gate::authorize('view', $assignment);

        $query = TimesheetReport::query()
            ->whereIn('timesheet_id', function (QueryBuilder  $query) use ($assignment) {
                $query->select('id')->from('timesheets')->where('status', '>', Timesheet::DRAFT)->where('assignment_id', $assignment->id);
            });

        $query->with([
            'attachment', 'closed_or_rev_by'
        ]);

        return $query->paginate();
    }
}
