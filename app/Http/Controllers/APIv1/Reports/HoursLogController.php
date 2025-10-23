<?php

namespace App\Http\Controllers\APIv1\Reports;

use App\Http\Controllers\APIv1\Controller;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\AllowedFilter;

class HoursLogController extends Controller
{
    protected function allowedFilters()
    {
        $columns = [
            'inspector_name',
            'client_group',
            'client_name',
            'client_code',
            'reference_number',
            'project_title',
            'main_vendor_name',
            'client_invoice_number',
            'contractor_invoice_number'
        ];

        return [
            AllowedFilter::callback('keywords', function (Builder $query, $value) use ($columns) {
                $query->whereAny($columns, 'like', "%$value%");
            })
        ];
    }

    public function __invoke()
    {

        return $this->getQueryBuilder()->whereAny(['org_id', 'operation_org_id'], auth()->user()->user_role->org_id)->paginate();
    }
}
