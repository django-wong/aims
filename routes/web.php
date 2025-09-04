<?php

use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InspectorController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\MagicLinkController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SetupController;
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
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('setup', [SetupController::class, 'index'])->name('setup');

    // Projects
    Route::controller(ProjectController::class)->group(function () {
        Route::get('projects/{id}', 'edit')->name('projects.edit');
        Route::get('projects', 'index')->name('projects');
    });

    // Invoices
    Route::get('invoices', [InvoiceController::class, 'index'])->name('invoices');

    // Clients
    Route::get('clients', [ClientController::class, 'index'])->name('clients');
    Route::get('clients/{id}', [ClientController::class, 'edit'])
        ->name('clients.edit');

    // Vendors
    Route::get('vendors', [VendorController::class, 'index'])->name('vendors');
    Route::get('vendors/{vendor}', [VendorController::class, 'edit'])
        ->name('vendors.edit');

    // Quotes - Not implemented yet
    Route::inertia('quotes', '404')->name('quotes');

    // Assignments
    Route::get('assignments', [AssignmentController::class, 'index'])->name('assignments');
    Route::get('assignments/{id}', [AssignmentController::class, 'edit'])->name('assignments.edit');
    Route::get('assignments/{id}/record', [AssignmentController::class, 'record'])->name('assignments.record');
    Route::get('assignments/{id}/pdf', [AssignmentController::class, 'pdf'])->name('assignments.pdf');

    // Attachments
    Route::get('attachments/{id}/download', [AttachmentController::class, 'download'])->name('attachments.download');

    // Timesheets
    Route::get('timesheets', [TimesheetController::class, 'index'])->name('timesheets');
    Route::post('timesheets/capture', [TimesheetController::class, 'capture'])->name('timesheets.capture');
    Route::get('timesheets/captured', [TimesheetController::class, 'captured'])->name('timesheets.captured');

    // Purchase Orders
    Route::get('purchase-orders', [PurchaseOrderController::class, 'index'])->name('purchase-orders');
    Route::get('purchase-orders/{id}', [PurchaseOrderController::class, 'edit'])->name('purchase-orders.edit');

    // Users & Impersonation
    Route::get('users', [UserController::class, 'index'])->name('users');
    Route::get('users/{id}/impersonate', [UserController::class, 'impersonate'])->name('impersonate');
    Route::get('users/leave-impersonation', function (Request $request) {
        Auth::user()->leaveImpersonation();
        $request->session()->remove('password_hash_web');
        return redirect()
            ->route('dashboard');
    })->name('leave-impersonation');

    Route::get('notification-of-inspection', function () {
        return Inertia::render('404');
    })->name('notification-of-inspection');

    // Inspectors
    Route::get('inspectors', [InspectorController::class, 'index'])->name('inspectors');
    Route::get('inspectors/{id}/edit', [InspectorController::class, 'edit']);

    // Reports
    Route::controller(ReportController::class)->prefix('reports')->group(function () {
        Route::get('hours-entry-all', 'hours_entry_all')->name('reports.hours-entry-all');
        Route::get('hours-entry-bie-local', 'hours_entry_bie_local')->name('reports.hours-entry-bie-local');
        Route::get('hours-entry-other', 'hours_entry_other')->name('reports.hours-entry-other');
        Route::get('field-operatives-manhour-summary', 'field_operatives_manhour_summary')->name('reports.field-operatives-manhour-summary');
        Route::get('invoice-required', 'invoice_required')->name('reports.invoice-required');
        Route::get('man-hours', 'man_hours')->name('reports.man-hours');
        Route::get('reports-late', 'reports_late')->name('reports.reports-late');
    });

    // Fallback to 404 page for undefined routes
    Route::inertia('{any}', '404');
});

// --------------------- No more routes below this line --------------
