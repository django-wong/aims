<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class UserController
{
    public function impersonate($id)
    {
        $user = User::query()->findOrFail($id);

        Gate::authorize(
            'impersonate', $user
        );

        Auth::user()->impersonate($user);

        return redirect()->route('dashboard');
    }
}
