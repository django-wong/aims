<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\AssignmentDetail;
use App\Models\AssignmentInspector;
use App\Models\UserRole;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Gate;
use Barryvdh\DomPDF\Facade\Pdf;

class AssignmentController extends Controller
{
    public function edit(string $id, Request $request)
    {
        $assigned = AssignmentInspector::query()->where('assignment_id', $id)->where('user_id', auth()->id())->exists();

        // Redirect to timesheet if user is an inspector for the assignment
        if ($assigned) {
            return to_route('assignments.record', $id);
        }

        return inertia('assignments/edit', [
            'detail' => AssignmentDetail::query()->find($id),
            'assignment' => Assignment::query()
                ->with(
                    'project.client', 'operation_org', 'org', 'vendor', 'sub_vendor', 'assignment_type', 'purchase_order', 'skill', 'coordinator', 'operation_coordinator'
                )
                ->findOrFail($id),
        ]);
    }

    public function record(Request $request, string $id)
    {
        $request->validate([
            'start' => 'nullable|date_format:Y-m-d',
        ]);

        $assignment = Assignment::query()
            ->with(
                'project.client', 'operation_org', 'org', 'vendor', 'sub_vendor', 'assignment_type'
            )
            ->findOrFail($id);

        $assignment_inspector = $assignment->assignment_inspectors()->where('user_id', auth()->id())->with('assignment_type')->firstOrFail();

        Gate::allowIf(
            $assignment_inspector, 'You are not assigned as an inspector for this assignment.'
        );


        $start = Carbon::parse($request->input('start', now()->startOfWeek()->format('Y-m-d')))->startOfWeek()->format('Y-m-d');
        $end = Carbon::parse($start)->endOfWeek()->format('Y-m-d');

        $timesheet = $assignment->timesheets()->firstOrCreate([
            'start' => $start,
            'end' => $end,
            'user_id' => auth()->id(),
            'assignment_inspector_id' => $assignment_inspector->id,
        ]);

        return inertia('assignments/record', [
            'assignment' => $assignment,
            'timesheet' => $timesheet->load(['timesheet_items'])->refresh(),
            'start' => $start,
            'end' => $end,
            'inspection' => $assignment_inspector,
            'prev' => Carbon::parse($start)->subWeek()->format('Y-m-d'),
            'next' => Carbon::parse($start)->addWeek()->format('Y-m-d'),
        ]);
    }

    public function pdf(string $id, Request $request)
    {
        $assignment = Assignment::query()
            ->with(
                'project.client', 'operation_org', 'org', 'vendor', 'sub_vendor', 'assignment_type'
            )
            ->findOrFail($id);

        Gate::authorize('view', $assignment);

        $assignment_inspector = $assignment->assignment_inspectors()->where('user_id', $request->get('inspector', auth()->id()))->first();

        $data = [
            'assignment' => $assignment,
            'assignment_inspector' => $assignment_inspector,
        ];

        if ($request->input('html')) {
            return view('pdfs.assignment-form', $data);
        }

        $pdf = Pdf::loadView('pdfs.assignment-form', $data);

        return $pdf->stream("assignment-{$assignment->id}.pdf");
    }

    public function index()
    {
        Gate::authorize('viewAny', Assignment::class);

        return inertia('assignments');

        // $role = auth()->user()->user_role->role;
        //
        // if ($role == UserRole::INSPECTOR) {
        //     return inertia(
        //         'assignments/for-inspectors'
        //     );
        // }
        //
        // return $role == UserRole::CLIENT ? inertia('assignments/for-clients') : inertia('assignments');
    }
}
