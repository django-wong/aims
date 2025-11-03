<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class UserController
{
    public function impersonate($id, Request $request)
    {
        $user = User::query()->findOrFail($id);

        $allow = Gate::check('impersonate', $user);

        if (!$allow) {
            return redirect()->back()->with(
                'error', __('You are not allowed to impersonate this user.')
            );
        }

        Auth::user()->impersonate($user);

        $request->session()->remove('password_hash_web');
        $request->session()->put('return_to', url()->previous());

        if ($request->has('redirect_to')) {
            return redirect($request->get('redirect_to'));
        }
        return redirect()->route('dashboard');
    }

    public function index()
    {
        return inertia('users');
    }
}
