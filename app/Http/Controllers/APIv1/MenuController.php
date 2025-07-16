<?php

namespace App\Http\Controllers\APIv1;

use Illuminate\Http\Request;

class MenuController
{

    public function index(Request $request)
    {
        // $request->user()->user_role->role
        return [
            'main' => [
                'dashboard' => [
                    'name' => 'Dashboard',
                    'icon' => 'house',
                    'url' => route('dashboard'),
                    'component' => 'dashboard'
                ],
                'clients' => [
                    'name' => 'Clients',
                    'icon' => 'book-user',
                    'url' => route('clients'),
                    'component' => 'clients'
                ],
                'vendors' => [
                    'name' => 'Vendors',
                    'icon' => 'user-round-search',
                    'url' => route('vendors'),
                    'component' => 'vendors'
                ],
                // 'quotes' => [
                //     'name' => 'Quotes',
                //     'icon' => 'piggy-bank',
                //     'url' => route('quotes'),
                // ],
                'projects' => [
                    'name' => 'Projects',
                    'icon' => 'briefcase-business',
                    'url' => route('projects'),
                    'component' => 'projects'
                ],
                'assignments' => [
                    'name' => 'Assignments',
                    'icon' => 'contact',
                    'url' => route('assignments'),
                    'component' => 'assignments'
                ],
                'timesheets' => [
                    'name' => 'Timesheets',
                    'icon' => 'house',
                    'url' => route('timesheets'),
                    'component' => 'timesheets'
                ],
                'invoices' => [
                    'name' => 'Invoices',
                    'icon' => 'house',
                    'url' => route('invoices'),
                    'component' => 'invoices'
                ],
            ],
        ];
    }
}
