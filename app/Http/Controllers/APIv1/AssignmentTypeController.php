<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\StoreAssignmentTypeRequest;
use App\Http\Requests\APIv1\UpdateAssignmentTypeRequest;
use App\Models\AssignmentType;
use App\Models\CurrentOrg;
use Illuminate\Support\Facades\Gate;

class AssignmentTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->getQueryBuilder()->visible()->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAssignmentTypeRequest $request, CurrentOrg $org)
    {
        $assignment_type = AssignmentType::query()->create([
            ...$request->validated(),
            'org_id' => $org->id
        ]);

        return [
            'message' => 'Assignment Type created successfully.',
            'data' => $assignment_type,
        ];
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAssignmentTypeRequest $request, AssignmentType $assignmentType)
    {
        $assignmentType->update($request->validated());

        return [
            'message' => 'Assignment Type updated successfully.',
            'data' => $assignmentType,
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AssignmentType $assignmentType)
    {
        Gate::authorize('delete', $assignmentType);

        $assignmentType->delete();

        return [
            'message' => 'Assignment Type deleted successfully.',
        ];
    }
}
