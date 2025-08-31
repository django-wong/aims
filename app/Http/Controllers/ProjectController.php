<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Support\Facades\Gate;

class ProjectController extends Controller
{
    /**
     * Display a listing of the projects.
     */
    public function index()
    {
        Gate::authorize('viewAny', Project::class);
        return inertia('projects');
    }

    /**
     * Show the form for editing the specified project.
     */
    public function edit($id)
    {
        $project = Project::query()->findOrFail($id);

        Gate::authorize('view', $project);

        return inertia('projects/edit', [
            'project' => Project::query()->with(['client', 'project_type'])->findOrFail($id)
        ]);
    }
}
