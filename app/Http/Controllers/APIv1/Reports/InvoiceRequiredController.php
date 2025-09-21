<?php

namespace App\Http\Controllers\APIv1\Reports;

use App\Http\Controllers\APIv1\Controller;
use App\Models\CurrentOrg;
use App\Models\Timesheet;
use App\Models\TimesheetDetail;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\AllowedFilter;

class InvoiceRequiredController extends Controller
{
    protected function allowedFilters()
    {
        return [
            AllowedFilter::callback('keywords', function (Builder $query, $value) {
                if ($value) {
                    $query->whereAny([
                        'inspector_name',
                        'reference_number',
                        'client_business_name',
                        'client_group',
                        'client_code',
                        'main_vendor_name',
                        'sub_vendor_name',
                    ], 'like', "%$value%");
                }
            })
        ];
    }

    protected function getModel(): string
    {
        return TimesheetDetail::class;
    }

    public function index(CurrentOrg $org)
    {
        return $this->getQueryBuilder()->tap(function (Builder $query) use ($org) {
            $query->whereRaw("status = ? and ((org_id = ? and client_invoice_id is null) or (operation_org_id = ? and contractor_invoice_id is null))", [
                Timesheet::CLIENT_APPROVED, $org->id, $org->id,
            ]);
        })->paginate();
    }
}
