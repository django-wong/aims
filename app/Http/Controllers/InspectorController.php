<?php

namespace App\Http\Controllers;

use App\Models\InspectorProfile;
use App\Models\User;

class InspectorController
{
    public function index()
    {
        return inertia(
            'inspectors'
        );
    }

    public function edit(string $id)
    {

        return inertia(
            'inspectors/edit', [
                'inspector' => InspectorProfile::query()->with(['user.user_role', 'address'])->findOrFail($id),
            ]
        );
    }
}
