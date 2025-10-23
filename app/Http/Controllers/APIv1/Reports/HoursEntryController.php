<?php

namespace App\Http\Controllers\APIv1\Reports;

use App\Http\Controllers\APIv1\Controller;
use App\Models\HoursEntry;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;

class HoursEntryController extends Controller
{
    protected function allowedSorts()
    {
        return [
            'reference_number',
            'timesheet_id'
        ];
    }

    protected function allowedFilters()
    {
        $columns = [
            'reference_number',
            'inspector_name',
            'client_name',
            'client_group',
            'client_code',
            'org_name',
            'operation_org_name',
            'project_title',
            'main_vendor_name',
            'sub_vendor_name',
            'client_invoice_number',
            'contractor_invoice_number'
        ];

        return [
            AllowedFilter::callback('keywords', function (Builder $query, $value) use ($columns) {
                $query->whereAny($columns, 'like', "%$value%");
            })
        ];
    }

    public function __invoke(Request $request)
    {
        return $this->getQueryBuilder()->defaultSort('-timesheet_id')->whereAny(['org_id', 'operation_org_id'], $request->user()->user_role->org_id)->paginate();
    }
}
