<?php

use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('setup', 'setup')->name('setup');
    Route::controller(ProjectController::class)->group(function () {
        Route::get('projects/{id}', 'edit')->name('projects.edit');
        Route::get('projects', 'index')->name('projects');
    });
    Route::inertia('projects', 'projects')->name('projects');
    Route::inertia('invoices', 'invoices')->name('invoices');
    Route::inertia('clients', 'clients')->name('clients');
    Route::get('clients/{id}', [\App\Http\Controllers\ClientController::class, 'edit'])->name('clients.edit');
    Route::inertia('vendors', 'vendors')->name('vendors');
    Route::inertia('quotes', '404')->name('quotes');
    Route::inertia('assignments', 'assignments')->name('assignments');
    Route::inertia('timesheets', 'timesheets')->name('timesheets');
    Route::inertia('users', 'users')->name('users');
    Route::inertia('{any}', '404');

    Route::get('attachments/{id}/download', [AttachmentController::class, 'download'])->name('attachments.download');
    Route::get('assignments/{id}/preview', [AssignmentController::class, 'preview'])->name('assignments.preview');
});


Route::middleware(['signed', 'user'])->group(function () {
    Route::get('assignments/{id}/record', [AssignmentController::class, 'record'])
        ->name('assignments.record-timesheet');
});


