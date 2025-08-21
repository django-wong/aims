<?php

use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\TimesheetController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', fn() => redirect()->route('dashboard'))->name('home');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('setup', 'setup')->name('setup');

    Route::inertia('projects', 'projects')->name('projects');
    Route::controller(ProjectController::class)->group(function () {
        Route::get('projects/{id}', 'edit')->name('projects.edit');
        Route::get('projects', 'index')->name('projects');
    });

    Route::inertia('invoices', 'invoices')->name('invoices');

    Route::inertia('clients', 'clients')->name('clients');
    Route::get('clients/{id}', [ClientController::class, 'edit'])
        ->name('clients.edit');

    Route::inertia('vendors', 'vendors')->name('vendors');
    Route::inertia('quotes', '404')->name('quotes');

    Route::inertia('assignments', 'assignments')->name('assignments');
    Route::get('assignments/{id}', [AssignmentController::class, 'edit'])->name('assignments.edit');
    Route::get('assignments/{id}/timesheet', [AssignmentController::class, 'timesheet'])->name('assignments.timesheet');

    Route::get('attachments/{id}/download', [AttachmentController::class, 'download'])->name('attachments.download');

    Route::inertia('timesheets', 'timesheets')->name('timesheets');
    Route::post('timesheets/capture', [TimesheetController::class, 'capture'])->name('timesheets.capture');
    Route::get('timesheets/captured', [TimesheetController::class, 'captured'])->name('timesheets.captured');

    Route::get('purchase-orders', [PurchaseOrderController::class, 'index'])->name('purchase-orders');
    Route::get('purchase-orders/{id}', [PurchaseOrderController::class, 'edit'])->name('purchase-orders.edit');

    Route::inertia('users', 'users')->name('users');
    Route::get('users/{id}/impersonate', [UserController::class, 'impersonate'])->name('impersonate');
    Route::get('users/leave-impersonation', function () {
        Auth::user()->leaveImpersonation();
        return redirect()
            ->route('dashboard');
    })->name('leave-impersonation');

    Route::inertia('{any}', '404');
});


Route::middleware('signed')->group(function () {
    Route::get('assignments/{id}/record', [AssignmentController::class, 'record'])
        ->name('assignments.record-timesheet');
});


