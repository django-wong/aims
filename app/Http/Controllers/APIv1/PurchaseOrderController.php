<?php

namespace App\Http\Controllers\APIv1;

use App\Models\PurchaseOrder;
use App\Http\Requests\APIv1\PurchaseOrders\StoreRequest;
use Illuminate\Http\Request;

class PurchaseOrderController extends Controller
{

    protected function allowedIncludes()
    {
        return [
            'client',
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
                'client'
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
    public function update(Request $request, PurchaseOrder $purchaseOrder)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PurchaseOrder $purchaseOrder)
    {
        //
    }
}
