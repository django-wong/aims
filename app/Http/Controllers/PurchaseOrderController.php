<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;

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
        return inertia('purchase-orders/edit', [
            'purchase_order' => PurchaseOrder::query()->with('client')->findOrFail($id)
        ]);
    }
}
