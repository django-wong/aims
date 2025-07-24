<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\Assignments\StoreRequest;
use App\Models\Assignment;
use Illuminate\Http\Request;

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

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(
            $this->getQueryBuilder()->visible()->paginate()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        //
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
