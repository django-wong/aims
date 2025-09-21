<?php

namespace App\Http\Controllers\APIv1\Reports;

use App\Http\Controllers\APIv1\Controller;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\AllowedFilter;

class ApprovalEfficiencyController extends Controller
{
    protected function allowedFilters()
    {
        return [
            AllowedFilter::callback('keywords', function (Builder $query, $value) {
                $query->whereAny(['client_name', 'client_group_name', 'client_code'], 'like', "%$value%");
            })
        ];
    }

    public function index()
    {
        return $this->getQueryBuilder()->tap(function (Builder $query) {
            $query->where('org_id', auth()->user()->user_role->org_id);
        })->paginate();
    }
}
