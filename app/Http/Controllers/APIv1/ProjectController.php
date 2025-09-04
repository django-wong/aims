<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\Projects\StoreRequest;
use App\Http\Requests\APIv1\UpdateProjectRequest;
use App\Models\Project;
use App\Models\UserRole;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
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

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', Project::class);

        return $this->getQueryBuilder()->tap(function (Builder $query) {
            if (auth()->user()->isRole(UserRole::CLIENT)) {
                $query->where(
                    'client_id', auth()->user()->client?->id
                );
            }

            if (auth()->user()->isRole(UserRole::INSPECTOR)) {
                $query->whereIn(
                    'id', function (QueryBuilder $query) {
                        $query->select('project_id')->from('assignments')
                            ->leftJoin('assignment_inspectors', 'assignments.id', '=', 'assignment_inspectors.assignment_id')
                            ->where('assignment_inspectors.user_id', auth()->user()->id);
                    }
                );
            }
        })->scoped()->paginate();
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
    public function update(UpdateProjectRequest $request, Project $project)
    {
        $project->update($request->validated());

        return [
            'data' => $project->refresh(),
            'message' => 'Project updated successfully.',
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        //
    }
}
