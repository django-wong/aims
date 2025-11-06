<?php

namespace App\Http\Controllers;

use App\Models\Org;
use App\Models\UserRole;
use Illuminate\Http\Request;

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
}
