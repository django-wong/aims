<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Notifications\NewAssignmentIssued;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Gate;

class AssignmentController extends Controller
{
    public function record(string $id, Request $request)
    {
        return to_route('assignments.timesheet', $id);
    }

    public function edit(string $id)
    {
        return inertia('assignments/edit', [
            'assignment' => Assignment::query()
                ->with(
                    'project.client', 'operation_org', 'org', 'vendor', 'sub_vendor', 'assignment_type', 'inspector', 'purchase_order'
                )
                ->findOrFail($id),
        ]);
    }

    public function timesheet(Request $request, string $id)
    {
        $request->validate([
            'start' => 'nullable|date_format:Y-m-d',
        ]);

        $assignment = Assignment::query()
            ->with(
                'project.client', 'operation_org', 'org', 'vendor', 'sub_vendor', 'assignment_type', 'inspector'
            )
            ->findOrFail($id);

        Gate::authorize('inspect', $assignment);

        $start = $request->input('start', now()->startOfWeek()->format('Y-m-d'));
        $end = Carbon::parse($start)->endOfWeek()->format('Y-m-d');

        $timesheet = $assignment->timesheets()->firstOrCreate([
            'start' => $start,
            'end' => $end,
        ]);

        return inertia('assignments/record', [
            'assignment' => $assignment,
            'timesheet' => $timesheet->load(['timesheet_items'])->refresh(),
            'start' => $start,
            'end' => $end,
            'prev' => Carbon::parse($start)->subWeek()->format('Y-m-d'),
            'next' => Carbon::parse($start)->addWeek()->format('Y-m-d'),
        ]);
    }
}
