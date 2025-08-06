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

        $allow = Gate::check(
            'impersonate', $user
        );

        if (!$allow) {
            return redirect()->back()->with(
                'error', __('You are not allowed to impersonate this user.').time()
            );
        }

        Auth::user()->impersonate($user);

        return redirect()->route('dashboard');
    }
}
