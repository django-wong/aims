<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\Assignments\StoreRequest;
use App\Models\Assignment;
use App\Models\Org;
use App\Notifications\NewAssignmentIssued;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AssignmentController extends Controller
{

    protected function allowedIncludes()
    {
        return [
            'project', 'assignment_type', 'inspector', 'vendor', 'sub_vendor', 'operation_org', 'org'
        ];
    }

    protected function allowedSorts()
    {
        return [
            'created_at'
        ];
    }

    public function notify(string $id)
    {
        $assignment = Assignment::query()->findOrFail($id);

        Gate::allows('update', $assignment);

        $assignment->inspector->notify(
            new NewAssignmentIssued($assignment)
        );

        return response()->json([
            'message' => 'Inspector notified successfully.',
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', [Assignment::class]);

        return response()->json(
            $this->getQueryBuilder()->visible()->paginate()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        Gate::authorize('create', [Assignment::class, Org::current()]);

        $assignment = Org::current()->assignments()->create($request->validated());

        return response()->json([
            'data' => $assignment->load(
                'project', 'assignment_type', 'inspector', 'vendor', 'sub_vendor', 'operation_org'
            ),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Assignment $assignment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Assignment $assignment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Assignment $assignment)
    {
        //
    }
}
