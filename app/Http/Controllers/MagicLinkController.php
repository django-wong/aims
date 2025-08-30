<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MagicLinkController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        return redirect($request->get('redirect_to', '/'));
    }
}
