<?php

namespace App\Http\Controllers\APIv1;

use Illuminate\Http\Request;

class MenuController
{

    public function index(Request $request)
    {
        return config('menu')[$request->user()->user_role->role];
    }
}
