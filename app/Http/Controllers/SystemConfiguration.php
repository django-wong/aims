<?php

namespace App\Http\Controllers;

class SystemConfiguration extends Controller
{
    public function __invoke()
    {
        return inertia('system-configuration');
    }
}
