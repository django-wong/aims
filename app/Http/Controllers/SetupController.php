<?php

namespace App\Http\Controllers;

use DateTimeZone;
use Illuminate\Http\Request;

class SetupController extends Controller
{
    //
    public function index()
    {
        return inertia('setup', [
            'timezones' => DateTimeZone::listIdentifiers(),
        ]);
    }
}
