<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceDetail;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    //
    public function index()
    {
        return inertia('invoices');
    }

    public function edit(Invoice $invoice)
    {
        return inertia('invoices/edit', [
            'invoice' => InvoiceDetail::query()->with('invoiceable')->findOrFail($invoice->id),
        ]);
    }
}
