<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\Budgets\IndexRequest;
use App\Models\Budget;
use App\Models\PurchaseOrder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;

class BudgetController extends Controller
{
    protected function allowedFilters()
    {
        return [
            AllowedFilter::callback('keywords', function (Builder $query, $value) {
                if ($value) {
                    $query->where('rate_code', 'like', "%$value%");
                }
            }),
        ];
    }

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
        return $this->getQueryBuilder()->tap(function (Builder  $query) use ($request) {
            $query->leftJoin('purchase_orders', 'purchase_orders.id', '=', 'budgets.purchase_order_id')
                ->select(
                    'budgets.*',
                    'purchase_orders.mileage_unit as mileage_unit',
                    'purchase_orders.currency as currency'
                );
            $query->where(
                'purchase_order_id', $request->input('purchase_order_id')
            );
        })->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBudgetRequest $request)
    {
        $budget = Budget::query()->create($request->validated());

        return [
            'data' => $budget
        ];
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
    public function update(UpdateBudgetRequest $request, Budget $budget)
    {
        $budget->update($request->validated());

        return [
            'data' => $budget,
            'message' => 'Budget updated successfully'
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DestroyBudgetRequest $request, Budget $budget)
    {
        $budget->delete();

        return [
            'message' => 'Budget deleted successfully'
        ];
    }
}
