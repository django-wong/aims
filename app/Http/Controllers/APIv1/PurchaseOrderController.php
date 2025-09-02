<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\DeletePurchaseOrderRequest;
use App\Http\Requests\APIv1\UpdatePurchaseOrderRequest;
use App\Models\Budget;
use App\Models\InspectorProfile;
use App\Models\PurchaseOrder;
use App\Http\Requests\APIv1\PurchaseOrders\StoreRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Spatie\QueryBuilder\AllowedFilter;

class PurchaseOrderController extends Controller
{

    public function calculate_gross_margins(Request $request, PurchaseOrder $purchase_order)
    {
        $validated = $request->validate([
            'assignment_type_id' => 'required|exists:assignment_types,id',
            'user_id' => 'required',
        ]);

        /**
         * @var Budget $budget
         * @var InspectorProfile $inspector_profile
         */
        $budget = $purchase_order->budgets()->where('assignment_type_id', $validated['assignment_type_id'])->firstOrFail();

        $inspector_profile = InspectorProfile::query()->where('user_id', $validated['user_id'])->firstOrFail();

        $inspection = ($budget->hourly_rate - $inspector_profile->hourly_rate) / $budget->hourly_rate * 100;
        $travel = ($budget->travel_rate - $inspector_profile->travel_rate) / $budget->travel_rate * 100;
        $total = $inspection + $travel;

        return response()->json([
            'data' => [
                'inspection' => round($inspection, 2),
                'travel' => round($travel, 2),
                'total' => round($total, 2),
            ]
        ]);
    }

    protected function allowedFilters()
    {
        return [
            AllowedFilter::callback('project_id', function (Builder $query, $value) {
                if (empty($value)) {
                    Gate::authorize('create', PurchaseOrder::class);
                } else {
                    $query->where('project_id', $value);
                }
            }),
        ];
    }

    protected function allowedIncludes()
    {
        return [
            'project',
            'project.client',
            'org'
        ];
    }

    protected function allowedSorts()
    {
        return [
            'created_at',
            'updated_at',
            'client_id',
            'org_id',
            'title'
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->getQueryBuilder()->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $purchaseOrder = PurchaseOrder::query()->create([
            ...$request->basic(),
            'org_id' => $request->user()->org->id,
        ]);

        return response()->json([
            'message' => 'Purchase order created successfully.',
            'data' => $purchaseOrder->load([
                'project'
            ])
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(PurchaseOrder $purchaseOrder)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePurchaseOrderRequest $request, PurchaseOrder $purchase_order)
    {
        $purchase_order->update($request->basic());

        return [
            'message' => 'Purchase order updated successfully.',
            'data' => $purchase_order
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeletePurchaseOrderRequest $request, PurchaseOrder $purchase_order)
    {
        try {
            $purchase_order->delete();
        } catch (QueryException $e) {
            if ($e->getCode() == 23000) {
                return response()->json([
                    'message' => 'Failed to delete purchase order. It may be linked to other records.'
                ], 400);
            }
            throw $e;
        }

        return response()->json([
            'message' => 'Purchase order deleted successfully.'
        ]);
    }
}
