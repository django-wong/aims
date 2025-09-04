<?php

namespace App\Http\Controllers;

use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        Gate::authorize('viewDashboard');

        return match ($request->user()->user_role->role) {
            UserRole::CLIENT => inertia('dashboard/client'),
            UserRole::INSPECTOR => inertia('dashboard/inspector'),
            default => inertia('dashboard'),
        };
    }
}
