<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use App\Models\QuoteDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class QuoteController extends Controller
{
    //
    public function index()
    {
        return inertia('quotes');
    }

    public function edit(Quote $quote)
    {
        Gate::authorize('view', $quote);

        return inertia('quotes/edit', [
            'quote' => QuoteDetail::query()->find($quote->id),
        ]);
    }
}
