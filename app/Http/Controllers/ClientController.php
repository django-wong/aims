<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function edit($id, Request $request)
    {
        $client = Client::query()->with(['user', 'address', 'coordinator', 'reviewer'])->findOrFail($id);

        return Inertia::render('clients/edit', [
            'client' => $client,
            'can' => [
                'update' => Gate::allows('update', $client),
            ],
        ]);
    }

    public function index()
    {
        Gate::authorize('viewAny', Client::class);
        return inertia('clients');
    }
}
