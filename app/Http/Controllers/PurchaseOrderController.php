<?php

namespace App\Http\Controllers;

class PurchaseOrderController extends Controller
{
    public function index()
    {
        return inertia('purchase-orders', [
            'title' => 'Purchase Orders',
            'description' => 'Manage your purchase orders here.',
        ]);
    }
}
