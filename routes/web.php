<?php

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
    Route::inertia('projects', 'projects')->name('projects');
    Route::inertia('invoices', 'invoices')->name('invoices');
    Route::inertia('clients', 'clients')->name('clients');
    Route::inertia('vendors', '404')->name('vendors');
    Route::inertia('quotes', '404')->name('quotes');
    Route::inertia('assignments', '404')->name('assignments');
    Route::inertia('timesheets', '404')->name('timesheets');
    Route::inertia('{any}', '404');
});

