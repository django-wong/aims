<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\Assignments\SignOffRequest;
use App\Http\Requests\APIv1\Assignments\StoreRequest;
use App\Http\Requests\APIv1\Assignments\UpdateRequest;
use App\Models\Assignment;
use App\Models\Org;
use App\Notifications\NewAssignmentIssued;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Spatie\QueryBuilder\AllowedFilter;
use Barryvdh\DomPDF\Facade\Pdf;

class AssignmentController extends Controller
{

    public function link(Assignment $assignment)
    {
        Gate::authorize('update', $assignment);

        return [
            'data' => URL::signedRoute(
                'assignments.record-timesheet', [
                    'id' => $assignment->id,
                    'user' => $assignment->inspector_id,
                ]
            )
        ];
    }

    protected function allowedIncludes()
    {
        return [
            'project', 'assignment_type', 'inspector', 'vendor', 'sub_vendor', 'operation_org', 'org', 'purchase_order'
        ];
    }

    protected function allowedSorts()
    {
        return [
            'created_at'
        ];
    }

    public function allowedFilters()
    {
        return [
            AllowedFilter::callback('project_id', function ($query, $value) {
                $query->where('project_id', $value);
            }),
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
    public function update(UpdateRequest $request, Assignment $assignment)
    {
        $assignment->update($request->validated());

        return [
            'message' => 'Assignment updated successfully.',
            'data' => $assignment->load(
                'project', 'assignment_type', 'inspector', 'vendor', 'sub_vendor', 'operation_org'
            ),
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Assignment $assignment)
    {
        //
    }

    public function pdf(Assignment $assignment)
    {
        return Pdf::loadView('pdfs.assignment-form', ['assignment' => $assignment])->download("assignment-{$assignment->id}.pdf");
    }
}
