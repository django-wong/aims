<?php

use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\InspectorController;
use App\Http\Controllers\MagicLinkController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\TimesheetController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VendorController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', fn() => redirect()->route('dashboard'))->name('home');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

Route::middleware('signed')->group(function () {
    Route::get('magic', MagicLinkController::class)->name('magic-link');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::inertia('setup', 'setup')->name('setup');

    // Projects
    Route::inertia('projects', 'projects')->name('projects');
    Route::controller(ProjectController::class)->group(function () {
        Route::get('projects/{id}', 'edit')->name('projects.edit');
        Route::get('projects', 'index')->name('projects');
    });

    // Invoices
    Route::inertia('invoices', 'invoices')->name('invoices');

    // Clients
    Route::inertia('clients', 'clients')->name('clients');
    Route::get('clients/{id}', [ClientController::class, 'edit'])
        ->name('clients.edit');

    // Vendors
    Route::inertia('vendors', 'vendors')->name('vendors');
    Route::get('vendors/{vendor}', [VendorController::class, 'edit'])
        ->name('vendors.edit');
    Route::inertia('quotes', '404')->name('quotes');

    // Assignments
    Route::inertia('assignments', 'assignments')->name('assignments');
    Route::get('assignments/{id}', [AssignmentController::class, 'edit'])->name('assignments.edit');
    Route::get('assignments/{id}/record', [AssignmentController::class, 'record'])->name('assignments.record');
    Route::get('assignments/{id}/pdf', [AssignmentController::class, 'pdf'])->name('assignments.pdf');

    // Attachments
    Route::get('attachments/{id}/download', [AttachmentController::class, 'download'])->name('attachments.download');

    // Timesheets
    Route::inertia('timesheets', 'timesheets')->name('timesheets');
    Route::post('timesheets/capture', [TimesheetController::class, 'capture'])->name('timesheets.capture');
    Route::get('timesheets/captured', [TimesheetController::class, 'captured'])->name('timesheets.captured');

    // Purchase Orders
    Route::get('purchase-orders', [PurchaseOrderController::class, 'index'])->name('purchase-orders');
    Route::get('purchase-orders/{id}', [PurchaseOrderController::class, 'edit'])->name('purchase-orders.edit');

    // Users & Impersonation
    Route::inertia('users', 'users')->name('users');
    Route::get('users/{id}/impersonate', [UserController::class, 'impersonate'])->name('impersonate');
    Route::get('users/leave-impersonation', function (Request $request) {
        Auth::user()->leaveImpersonation();
        $request->session()->remove('password_hash_web');
        return redirect()
            ->route('dashboard');
    })->name('leave-impersonation');

    // Inspectors
    Route::get('inspectors', [InspectorController::class, 'index'])->name('inspectors');
    Route::get('inspectors/{id}/edit', [InspectorController::class, 'edit']);

    // Fallback to 404 page for undefined routes
    Route::inertia('{any}', '404');
});

// --------------------- No more routes below this line --------------
