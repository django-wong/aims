<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\Budgets\IndexRequest;
use App\Models\Budget;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    protected function allowedIncludes()
    {
        return [
            'assignment_type'
        ];
    }

    protected function allowedSorts()
    {
        return [
            'rate_code'
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(IndexRequest $request)
    {
        return $this->getQueryBuilder()->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Budget $rate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Budget $rate)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Budget $rate)
    {
        //
    }
}
