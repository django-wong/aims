<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceDetail;
use App\Models\UserRole;
use App\Notifications\InvoiceIssued;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class InvoiceController extends Controller
{
    //
    public function index()
    {
        if (auth()->user()->isRole(UserRole::CLIENT)) {
            return inertia('client-invoices');
        }
        return inertia('invoices');
    }

    public function edit(Invoice $invoice)
    {
        Gate::authorize('view', $invoice);

        return inertia('invoices/edit', [
            'invoice' => InvoiceDetail::query()->with('invoiceable')->findOrFail($invoice->id),
        ]);
    }

    public function preview(Invoice $invoice, string $preview)
    {
        return (new InvoiceIssued($invoice))->toMail(auth()->user())->render();
    }
}
