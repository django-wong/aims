<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\AssignmentInspector;
use App\Notifications\NewAssignmentIssued;
use App\Notifications\TimesheetIsWaitingForContractorOfficeApproval;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Gate;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;

class AssignmentController extends Controller
{
    public function edit(string $id)
    {
        $assignment = Assignment::query()
            ->with(
                'project.client', 'operation_org', 'org', 'vendor', 'sub_vendor', 'assignment_type', 'purchase_order'
            )
            ->findOrFail($id);

        // Redirect to timesheet if user is an inspector for the assignment
        // if (Gate::allows('inspect', $assignment)) {
        //     return to_route(
        //         'assignments.record', $assignment->id
        //     );
        // }

        return inertia('assignments/edit', [
            'capability' => [
                'TODO'
            ],
            'assignment' => $assignment,
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

        $inspection = $assignment->assignment_inspectors()->where('user_id', auth()->id())->with('assignment_type')->firstOrFail();

        Gate::allowIf(
            $inspection, 'You are not assigned as an inspector for this assignment.'
        );


        $start = $request->input('start', now()->startOfWeek()->format('Y-m-d'));
        $end = Carbon::parse($start)->endOfWeek()->format('Y-m-d');

        $timesheet = $assignment->timesheets()->firstOrCreate([
            'start' => $start,
            'end' => $end,
            'user_id' => auth()->id(),
        ]);

        if ($request->has('preview_contractor_notification')) {
            return (new TimesheetIsWaitingForContractorOfficeApproval($timesheet))->toMail(auth()->user());
        }

        return inertia('assignments/record', [
            'assignment' => $assignment,
            'timesheet' => $timesheet->load(['timesheet_items'])->refresh(),
            'start' => $start,
            'end' => $end,
            'inspection' => $inspection,
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
}
