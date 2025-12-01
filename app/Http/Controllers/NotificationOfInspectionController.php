<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNotificationOfInspectionRequest;
use App\Http\Requests\UpdateNotificationOfInspectionRequest;
use App\Models\NotificationOfInspection;
use Illuminate\Support\Facades\Gate;

class NotificationOfInspectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('view-any', NotificationOfInspection::class);

        return inertia('notification-of-inspections/index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(NotificationOfInspection $notification_of_inspection)
    {
        Gate::authorize('view', $notification_of_inspection);

        return inertia('notification-of-inspections/edit', [
            'notification_of_inspection' => $notification_of_inspection->load('assignment', 'client', 'inspector'),
        ]);
    }
}
