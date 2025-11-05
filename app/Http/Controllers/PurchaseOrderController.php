<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use Illuminate\Support\Facades\Gate;

class PurchaseOrderController extends Controller
{
    public function index()
    {
        return inertia('purchase-orders', [
            'title' => 'Purchase Orders',
            'description' => 'Manage your purchase orders here.',
        ]);
    }

    public function edit(string $id)
    {
        $po = PurchaseOrder::query()->with('project.client')->findOrFail($id);

        Gate::authorize('view', $po);

        return inertia('purchase-orders/edit', [
            'purchase_order' => $po
        ]);
    }
}
