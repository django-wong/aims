<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function edit($id, Request $request)
    {
        return Inertia::render('clients/edit', [
            'client' => Client::query()->with(['user', 'address', 'coordinator', 'reviewer'])->findOrFail($id),
        ]);
    }
}
