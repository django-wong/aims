<?php

use App\Http\Controllers\APIv1\AssignmentController;
use App\Http\Controllers\APIv1\ClientController;
use App\Http\Controllers\APIv1\CommentController;
use App\Http\Controllers\APIv1\MenuController;
use App\Http\Controllers\APIv1\OrgController;
use App\Http\Controllers\APIv1\ProjectController;
use App\Http\Controllers\APIv1\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('menus', [MenuController::class, 'index']);

    Route::get('projects/next-project-number', [ProjectController::class, 'nextProjectNumber']);

    Route::apiResources([
        'projects' => ProjectController::class,
        'clients' => ClientController::class,
        'orgs' => OrgController::class,
        'users' => UserController::class,
        'vendors' => \App\Http\Controllers\APIv1\VendorController::class,
        'project-types' => \App\Http\Controllers\APIv1\ProjectTypeController::class,
        'comments' => CommentController::class,
        'assignments' => AssignmentController::class,
        'assignment-types' => \App\Http\Controllers\APIv1\AssignmentTypeController::class,
        'timesheets' => \App\Http\Controllers\APIv1\TimesheetController::class,
        'timesheet-items' => \App\Http\Controllers\APIv1\TimesheetItemController::class,
    ]);

    Route::post('users/{id}/update-role', [UserController::class, 'updateRole'])->name('users.update_role');
    Route::post('assignments/{id}/notify-inspector', [AssignmentController::class, 'notify'])->name('assignments.notify_inspector');
});
