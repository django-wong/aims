<?php

namespace App\Http\Controllers\APIv1\Reports;

use App\Http\Controllers\APIv1\Controller;
use App\Models\CurrentOrg;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class ManHoursMonthlyByYearController extends Controller
{
    public function index(CurrentOrg $org)
    {
        return $this->getQueryBuilder()->tap(function (Builder $query) use ($org) {
            $query->where('org_id', $org->id);
            $query->select([
                'client_business_name',
                'client_group',
                'client_code',
                'year',
                DB::raw('json_objectagg(month, hours) as monthly_hours'),
                DB::raw('sum(hours) as total_hours'),
            ]);
            $query->groupBy('client_id', 'year');
        })->paginate();
    }
}
