<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VendorController extends Controller
{
    public function edit(Vendor $vendor, Request $request)
    {
        return Inertia::render('vendors/edit', [
            'vendor' => $vendor->load(['address']),
        ]);
    }
}
