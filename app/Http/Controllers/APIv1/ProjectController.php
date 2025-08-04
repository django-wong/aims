<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\Projects\StoreRequest;
use App\Models\Project;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Spatie\QueryBuilder\AllowedFilter;

class ProjectController extends Controller
{
    protected function allowedFilters()
    {
        return [
            AllowedFilter::exact('client_id'),
            AllowedFilter::exact('project_type_id'),
            AllowedFilter::exact('status'),
            AllowedFilter::callback('keywords', function (Builder $query, $value) {
                $query->whereAny(['title', 'po_number'], 'like', "%{$value}%");
            }),
        ];
    }


    protected function allowedIncludes()
    {
        return [
            'client', 'project_type'
        ];
    }

    protected function allowedSorts()
    {
        return ['title'];
    }

    public function nextProjectNumber()
    {
        Gate::authorize('viewAny', Project::class);

        return response()->json([
            'data' => Project::nextProjectNumber(),
            'message' => 'Next project number retrieved successfully.',
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', Project::class);

        return $this->getQueryBuilder()->scoped()->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $project = Project::query()->create([
            ...$request->validated(),
            'org_id' => $request->user()->org->id,
        ]);

        return response()->json([
            'data' => $project->refresh(),
            'message' => 'Project created successfully.',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        //
    }
}
