<?php

namespace App\Http\Controllers;

use App\Models\Project;

class ProjectController extends Controller
{
    /**
     * Display a listing of the projects.
     */
    public function index()
    {
        return inertia('projects');
    }

    /**
     * Show the form for editing the specified project.
     */
    public function edit($id)
    {
        return inertia('projects/edit', ['project' => Project::query()->findOrFail($id)]);
    }
}
