<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Notifications\NewAssignmentIssued;
use Illuminate\Http\Request;
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

    public function timesheet(string $id)
    {
        $assignment = Assignment::query()
            ->with(
                'project.client', 'operation_org', 'org', 'vendor', 'sub_vendor', 'assignment_type', 'inspector'
            )
            ->findOrFail($id);

        Gate::authorize('view', $assignment);

        $timesheet = $assignment->timesheets()->firstOrCreate();

        return inertia('assignments/record', [
            'assignment' => $assignment,
            'timesheet' => $timesheet->load(['timesheet_items']),
        ]);
    }
}
