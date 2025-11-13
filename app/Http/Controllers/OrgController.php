<?php

namespace App\Http\Controllers;

use App\Models\Org;
use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class OrgController extends Controller
{
    public function switchOrg(Org $org, Request $request)
    {
        $role = UserRole::query()->where('org_id', $org->id)
            ->where('role', UserRole::ADMIN)
            ->first();

        $controller = app(UserController::class);

        return $controller->impersonate($role->user_id, $request);
    }

    public function index()
    {
        Gate::authorize('create', Org::class);
        return inertia(component: 'orgs');
    }
}
