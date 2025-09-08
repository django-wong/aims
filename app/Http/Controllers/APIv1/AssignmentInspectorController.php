<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\StoreAssignmentInspectorRequest;
use App\Http\Requests\UpdateAssignmentInspectorRequest;
use App\Models\Assignment;
use App\Models\AssignmentInspector;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AssignmentInspectorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $validated = $request->validate([
            'assignment_id' => 'sometimes|nullable|exists:assignments,id',
        ]);

        return $this->getQueryBuilder()->tap(function (Builder $query) use ($validated) {
            $query->leftJoin('assignments', 'assignment_inspectors.assignment_id', '=', 'assignments.id')
                ->leftJoin('assignment_types', 'assignment_inspectors.assignment_type_id', '=', 'assignment_types.id')
                ->leftJoin('users', 'assignment_inspectors.user_id', '=', 'users.id');

            $query->where('assignment_id', $validated['assignment_id']);

            $query->select([
                'assignment_inspectors.*',
                'users.name as name',
                'assignment_types.name as assignment_type_name',
            ]);
        })->paginate();
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
    public function store(StoreAssignmentInspectorRequest $request)
    {
        $assignment = Assignment::query()->find($request->validated('assignment_id'));

        /**
         * @var \App\Models\Budget|null $budget
         */
        $budget = $assignment->purchase_order->budgets()->where('assignment_type_id', $request->validated('assignment_type_id'))->first();

        $data = [
            ...$request->validated(),
            'hourly_rate' => $budget?->hourly_rate ?? 0,
            'travel_rate' => $budget?->travel_rate ?? 0,
        ];


        $assignment_inspector = AssignmentInspector::query()
            ->updateOrCreate([
                'user_id' => $request->validated('user_id'),
                'assignment_id' => $request->validated('assignment_id'),
            ], $data);

        if ($assignment->status < Assignment::ASSIGNED) {
            $assignment->status = Assignment::ASSIGNED;
            $assignment->save();
        }

        return [
            'message' => 'Inspector assigned successfully.',
            'data' => $assignment_inspector->load('user', 'assignment', 'assignment_type')
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(AssignmentInspector $assignmentInspector)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AssignmentInspector $assignmentInspector)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAssignmentInspectorRequest $request, AssignmentInspector $assignmentInspector)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AssignmentInspector $assignmentInspector)
    {
        $assignmentInspector->delete();
        return [
            'message' => 'Inspector unassigned successfully.'
        ];
    }

    public function acknowledge(Request $request, AssignmentInspector $assignment_inspector)
    {
        Gate::authorize('ack', $assignment_inspector);

        $validated = $request->validate([
            'signature_base64' => 'required|string',
        ]);

        $assignment_inspector->acked_at = now();
        $assignment_inspector->signature_base64 = $validated['signature_base64'];

        $assignment_inspector->save();
        $assignment = $assignment_inspector->assignment;

        if ($assignment->status < Assignment::PARTIAL_ACKED) {
            $assignment->status = Assignment::PARTIAL_ACKED;
        }

        if (! ($assignment->assignment_inspectors()->whereNull('acked_at')->exists())) {
            $assignment->status = Assignment::ACKED;
        }

        $assignment->save();

        return [
            'message' => 'Inspector acknowledged successfully.',
            'data' => $assignment_inspector->load('user', 'assignment', 'assignment_type')
        ];
    }
}
