<?php

namespace App\Http\Controllers\APIv1;

use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

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
                ...(Gate::allows('viewDashboard') ? [
                    'dashboard' => [
                        'name' => 'Dashboard',
                        'icon' => 'house',
                        'url' => route('dashboard'),
                        'component' => 'dashboard'
                    ],
                ] : []),
                ...($when([UserRole::ADMIN, UserRole::STAFF, UserRole::PM, UserRole::FINANCE],[
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
                    ]
                ])),
                ...($when([UserRole::PM, UserRole::ADMIN, UserRole::STAFF, UserRole::CLIENT],[
                    'projects' => [
                        'name' => 'Projects',
                        'icon' => 'briefcase-business',
                        'url' => route('projects'),
                        'component' => 'projects'
                    ],
                ])),
                ...($when([UserRole::PM, UserRole::ADMIN, UserRole::STAFF, UserRole::FINANCE],[
                    'purchase-orders' => [
                        'name' => 'Purchase Orders (WO)',
                        'icon' => 'shopping-bag',
                        'url' => route('purchase-orders'),
                        'component' => 'purchase-orders'
                    ],
                ])),
                ...($when([UserRole::ADMIN, UserRole::PM, UserRole::CLIENT], [
                    'assignments' => [
                        'name' => 'Assignments',
                        'icon' => 'contact',
                        'url' => route('assignments'),
                        'component' => 'assignments'
                    ]
                ])),
                ...($when([UserRole::ADMIN, UserRole::PM, UserRole::FINANCE], [
                    'invoices' => [
                        'name' => 'Invoices',
                        'icon' => 'house',
                        'url' => route('invoices'),
                        'component' => 'invoices'
                    ],
                ])),
                ...($when([UserRole::ADMIN, UserRole::STAFF, UserRole::PM], [
                    'inspector' => [
                        'name' => 'Inspector (FieldOps)',
                        'icon' => 'users',
                        'url' => route('inspectors'),
                        'component' => 'inspectors'
                    ]
                ])),
                ...($when([UserRole::ADMIN], [
                    'users' => [
                        'name' => 'User & Access',
                        'icon' => 'users',
                        'url' => route('users'),
                        'component' => 'users'
                    ]
                ]))
            ],
        ];
    }
}
