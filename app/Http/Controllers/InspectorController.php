<?php

namespace App\Http\Controllers;

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
                'inspector' => User::query()->with('inspector_profile', 'address', 'user_role')->findOrFail($id),
            ]
        );
    }
}
