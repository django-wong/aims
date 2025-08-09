<?php

namespace App\Http\Controllers\APIv1;

use App\Models\UserRole;
use Illuminate\Http\Request;

class MenuController
{

    public function index(Request $request)
    {
        $user_role = $request->user()?->user_role;

        $when = function($roles, $then) use ($user_role) {
            return $user_role && $user_role->isAnyOf($roles) ? $then : [];
        };

        return [
            'main' => [
                ...($when([UserRole::ADMIN, UserRole::PM, UserRole::CLIENT, UserRole::STAFF, UserRole::INSPECTOR],[
                    'dashboard' => [
                        'name' => 'Dashboard',
                        'icon' => 'house',
                        'url' => route('dashboard'),
                        'component' => 'dashboard'
                    ],
                ])),
                ...($when([UserRole::ADMIN],[
                    'clients' => [
                        'name' => 'Clients',
                        'icon' => 'book-user',
                        'url' => route('clients'),
                        'component' => 'clients'
                    ]
                ])),
                ...($when([UserRole::ADMIN], [
                    'vendors' => [
                        'name' => 'Vendors',
                        'icon' => 'user-round-search',
                        'url' => route('vendors'),
                        'component' => 'vendors'
                    ]
                ])),
                ...($when([UserRole::PM, UserRole::ADMIN, UserRole::STAFF, UserRole::INSPECTOR],[
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
                ])),
                ...($when([UserRole::ADMIN, UserRole::PM], [
                    'invoices' => [
                        'name' => 'Invoices',
                        'icon' => 'house',
                        'url' => route('invoices'),
                        'component' => 'invoices'
                    ],
                ])),
                ...($when([UserRole::ADMIN], [
                    'users' => [
                        'name' => 'User & Access',
                        'icon' => 'users',
                        'url' => route('users'),
                        'component' => 'users'
                    ]
                ])),
            ],
        ];
    }
}
