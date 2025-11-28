<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNotificationOfInspectionRequest;
use App\Http\Requests\UpdateNotificationOfInspectionRequest;
use App\Models\NotificationOfInspection;

class NotificationOfInspectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('notification-of-inspections/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNotificationOfInspectionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(NotificationOfInspection $notificationOfInspection)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(NotificationOfInspection $notification_of_inspection)
    {
        $notification_of_inspection->load('assignment', 'client', 'inspector');

        return inertia('notification-of-inspections/edit', [
            'notification_of_inspection' => $notification_of_inspection,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNotificationOfInspectionRequest $request, NotificationOfInspection $notificationOfInspection)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NotificationOfInspection $notificationOfInspection)
    {
        //
    }
}
