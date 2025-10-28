<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Invoice;
use App\Models\Org;
use App\Models\Timesheet;
use App\Models\UserRole;
use App\Values\ClaimedHourGrowth;
use App\Values\ClaimedHours;
use App\Values\CurrentMonthRevenue;
use App\Values\LastMonthRevenue;
use App\Values\OpenAssignment;
use App\Values\PendingApprovalTimesheets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class DashboardController extends Controller
{
    private function getInspectorDashboardData()
    {
        return [
        ];
    }

    private function getDashboardData()
    {

        $org = Org::current();

        return [
            'open_assignment' => new OpenAssignment(),
            'pending_approval' => new PendingApprovalTimesheets(),
            'invoice' => [
                'outbound' => Invoice::query()->where('org_id', $org->id)->count(),
                'inbound' => Invoice::query()->whereMorphedTo('invoiceable', $org)->count(),
                'rejected' => Invoice::query()->where('org_id', $org->id)
                    ->whereNotNull('rejected_at')->count(),
            ],
            'hours' => [
                'claimed' => new ClaimedHours(),
                'growing' => new ClaimedHourGrowth(),
            ],
            'revenue' => [
                'this_year' => new \App\Values\CurrentYearRevenue(),
            ],
        ];
    }

    private function getClientDashboardData()
    {
        return [];
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        Gate::authorize('viewDashboard');

        return match ($request->user()->user_role->role) {
            UserRole::CLIENT => inertia(
                'dashboard/client', $this->getClientDashboardData()
            ),
            UserRole::INSPECTOR => inertia(
                'dashboard/inspector', $this->getInspectorDashboardData()
            ),
            default => inertia(
                'dashboard', $this->getDashboardData()
            ),
        };
    }
}
