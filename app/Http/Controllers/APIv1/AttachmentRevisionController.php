<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\AttachmentRevisions\StoreAttachmentRevisionRequest;
use App\Http\Requests\APIv1\AttachmentRevisions\UpdateAttachmentRevisionRequest;
use App\Models\AttachmentRevision;

class AttachmentRevisionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreAttachmentRevisionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(AttachmentRevision $attachmentRevision)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AttachmentRevision $attachmentRevision)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttachmentRevisionRequest $request, AttachmentRevision $attachmentRevision)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AttachmentRevision $attachmentRevision)
    {
        //
    }
}
