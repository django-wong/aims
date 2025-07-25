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
}
