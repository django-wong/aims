<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Notifications\NewAssignmentIssued;

class AssignmentController extends Controller
{
    public function preview($id)
    {
        $notification = new NewAssignmentIssued(Assignment::query()->findOrFail($id));

        return $notification->toMail(auth()->user());
    }

    public function record(string $id)
    {
        $assignment = Assignment::query()
            ->with(
                'project.client', 'operation_org', 'org', 'vendor', 'sub_vendor', 'assignment_type', 'inspector'
            )
            ->findOrFail($id);

        return inertia('assignments/record', [
            'assignment' => $assignment,
        ]);
    }
}
