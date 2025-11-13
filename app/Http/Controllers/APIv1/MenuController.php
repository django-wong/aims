<?php

namespace App\Http\Controllers\APIv1;

use App\Models\Invoice;
use App\Models\Org;
use App\Models\Timesheet;
use App\Models\UserRole;
use App\Values\OpenAssignment;
use App\Values\PendingApprovalTimesheets;
use App\Values\PendingInvoices;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class MenuController
{

    public function __invoke(Request $request)
    {
        $user_role = $request->user()?->user_role;

        if (empty($user_role)) {
            return [

            ];
        }

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
                ...(Gate::allows('create', Org::class) ? [
                    'orgs' => [
                        'name' => 'Organizations',
                        'icon' => 'building-2',
                        'url' => route('orgs'),
                    ],
                ] : []),
                ...($when([UserRole::ADMIN, UserRole::STAFF, UserRole::PM, UserRole::FINANCE],[
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
                ...($when([UserRole::PM, UserRole::ADMIN, UserRole::STAFF, UserRole::CLIENT],[
                    'projects' => [
                        'name' => 'Projects',
                        'icon' => 'briefcase-business',
                        'url' => route('projects'),
                    ],
                    'purchase-orders' => [
                        'name' => 'Work Orders (WO)',
                        'icon' => 'shopping-bag',
                        'url' => route('purchase-orders'),
                    ],
                ])),
                ...($when([UserRole::PM, UserRole::ADMIN, UserRole::PM, UserRole::STAFF, UserRole::FINANCE],[
                    'quotes' => [
                        'name' => 'Quotations',
                        'icon' => 'sheet',
                        'url' => route('quotations'),
                    ],
                ])),
                ...($when([UserRole::ADMIN, UserRole::PM, UserRole::STAFF, UserRole::CLIENT, UserRole::INSPECTOR], [
                    'assignments' => [
                        'name' => 'Assignments',
                        'icon' => 'contact',
                        'url' => route('assignments'),
                        'badge' => new OpenAssignment()
                    ]
                ])),
                ...($when([UserRole::ADMIN, UserRole::PM, UserRole::STAFF, UserRole::CLIENT], [
                    'timesheets' => [
                        'name' => 'Timesheets',
                        'icon' => 'clock',
                        'url' => route('timesheets'),
                        'badge' => new PendingApprovalTimesheets()
                    ]
                ])),
                ...($when([UserRole::ADMIN, UserRole::PM, UserRole::CLIENT, UserRole::STAFF], [
                    'noi' => [
                        'name' => 'Notification of Inspection (NOI)',
                        'icon' => 'contact',
                        'url' => route('notification-of-inspection'),
                    ]
                ])),
                ...($when([UserRole::ADMIN, UserRole::PM, UserRole::STAFF, UserRole::FINANCE, UserRole::CLIENT], [
                    'invoices' => [
                        'name' => 'Invoices',
                        'icon' => 'scroll-text',
                        'url' => route('invoices'),
                        'badge' => (new PendingInvoices())->value()
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
                ])),
            ],

            'reports' => $this->reports()
        ];
    }

    private function reports()
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
                'name' => 'Hours Entry Logs',
                'url' => route('reports.hours-entry'),
                'icon' => 'calendar-days'
            ],
            [
                'name' => 'Man-hours',
                'url' => route('reports.man-hours'),
                'icon' => 'clock-fading',
                'children' => [
                    [
                        'name' => 'By Year',
                        'icon' => 'folder',
                        'url' => route('reports.man-hours-2')
                    ],
                    [
                        'name' => 'Monthly By Year',
                        'icon' => 'folder',
                        'url' => route('reports.man-hours-3')
                    ]
                ]
            ],
            [
                'name' => 'Skill Matrix',
                'url' => route('reports.skill-matrix'),
                'icon' => 'hammer',
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
            [
                'name' => 'Approval Efficiency',
                'url' => route('reports.approval-efficiency'),
                'icon' => 'gauge',
            ],
            [
                'name' => 'Expiring Certificates',
                'url' => route('reports.expiring-certificates'),
                'icon' => 'badge-alert',
            ],
        ];
    }
}
