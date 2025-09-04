<?php

namespace App\Http\Controllers\APIv1;

use App\Models\Timesheet;
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
                    ],
                ] : []),
                ...($when([UserRole::ADMIN, UserRole::STAFF, UserRole::PM, UserRole::FINANCE, UserRole::INSPECTOR],[
                    'clients' => [
                        'name' => 'Clients',
                        'icon' => 'book-user',
                        'url' => route('clients'),
                    ],
                    'vendors' => [
                        'name' => 'Vendors',
                        'icon' => 'user-round-search',
                        'url' => route('vendors'),
                    ]
                ])),
                ...($when([UserRole::PM, UserRole::ADMIN, UserRole::STAFF, UserRole::CLIENT, UserRole::INSPECTOR],[
                    'projects' => [
                        'name' => 'Projects',
                        'icon' => 'briefcase-business',
                        'url' => route('projects'),
                    ],
                ])),
                ...($when([UserRole::PM, UserRole::ADMIN, UserRole::PM, UserRole::STAFF, UserRole::FINANCE],[
                    'purchase-orders' => [
                        'name' => 'Work Orders (WO)',
                        'icon' => 'shopping-bag',
                        'url' => route('purchase-orders'),
                    ],
                ])),
                ...($when([UserRole::ADMIN, UserRole::PM, UserRole::STAFF, UserRole::CLIENT, UserRole::INSPECTOR], [
                    'assignments' => [
                        'name' => 'Assignments',
                        'icon' => 'contact',
                        'url' => route('assignments'),
                    ]
                ])),
                ...($when([UserRole::ADMIN, UserRole::PM, UserRole::STAFF, UserRole::CLIENT], [
                    'timesheets' => [
                        'name' => 'Timesheets',
                        'icon' => 'clock',
                        'url' => route('timesheets'),
                        'badge' => Timesheet::query()->pending()->count()
                    ]
                ])),
                ...($when([UserRole::ADMIN, UserRole::PM, UserRole::CLIENT, UserRole::STAFF], [
                    'noi' => [
                        'name' => 'NOI',
                        'icon' => 'contact',
                        'url' => route('notification-of-inspection'),
                    ]
                ])),
                ...($when([UserRole::ADMIN, UserRole::PM, UserRole::STAFF, UserRole::FINANCE, UserRole::CLIENT], [
                    'invoices' => [
                        'name' => 'Invoices',
                        'icon' => 'scroll-text',
                        'url' => route('invoices'),
                    ],
                ])),
                ...($when([UserRole::ADMIN, UserRole::STAFF, UserRole::PM], [
                    'inspector' => [
                        'name' => 'Inspector (FieldOps)',
                        'icon' => 'users',
                        'url' => route('inspectors'),
                    ]
                ])),
                ...($when([UserRole::ADMIN], [
                    'users' => [
                        'name' => 'User & Access',
                        'icon' => 'users',
                        'url' => route('users'),
                    ],
                    'system-configuration' => [
                        'name' => 'System Configuration',
                        'icon' => 'cog',
                        'url' => route('system-configuration'),
                    ]
                ]))
            ],
        ];
    }

    public function reports()
    {
        if (auth()->user()->isAnyRole([UserRole::CLIENT, UserRole::INSPECTOR, UserRole::VENDOR])) {
            return [];
        }

        return [
            [
                'name' => 'Field Operatives Manhour Summary',
                'url' => route('reports.field-operatives-manhour-summary'),
                'icon' => 'blocks',
            ],
            [
                'name' => 'Hours Entry - All',
                'url' => route('reports.hours-entry-all'),
                'icon' => 'file-clock',
                'children' => [
                    [
                        'name' => 'BIE Local',
                        'url' => route('reports.hours-entry-bie-local'),
                        'icon' => 'folder',
                    ],
                    [
                        'name' => 'Others',
                        'url' => route('reports.hours-entry-bie-local'),
                        'icon' => 'folder',
                    ]
                ]
            ],
            [
                'name' => 'Man-hours summary',
                'url' => route('reports.man-hours'),
                'icon' => 'clock-plus',
                'children' => [
                    [
                        'name' => 'Local',
                        'icon' => 'folder'
                    ],
                    [
                        'name' => 'Others',
                        'icon' => 'folder'
                    ],
                    [
                        'name' => 'By Year - Local',
                        'icon' => 'folder'
                    ],
                    [
                        'name' => 'By Year - Others',
                        'icon' => 'folder'
                    ],
                    [
                        'name' => 'Monthly By Year',
                        'icon' => 'folder'
                    ]
                ]
            ],
            [
                'name' => 'Invoice Required',
                'url' => route('reports.invoice-required'),
                'icon' => 'receipt',
            ],
            [
                'name' => 'Reports Late',
                'url' => route('reports.reports-late'),
                'icon' => 'file-warning',
            ],
        ];
    }
}
