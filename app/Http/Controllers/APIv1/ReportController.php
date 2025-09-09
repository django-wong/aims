<?php

namespace App\Http\Controllers\APIv1;

use App\Models\HoursEntry;
use App\Models\HoursLog;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ReportController
{
    //
    public function hours_entry(Request $request)
    {
        return HoursEntry::query()->tap(function (Builder $query) use ($request) {
            $org = $request->user()->user_role->org_id;
            match ($request->input('type')) {
                'others' => $query->where('org_id', '!=', $org),
                'local' => $query->where('org_id', $org),
                default => null,
            };
        })->paginate();
    }

    public function hours_log()
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

        $qb = QueryBuilder::for(HoursLog::class);

        $qb->allowedFilters([
            AllowedFilter::callback('keywords', function (Builder $query, $value) use ($columns) {
                $query->whereAny($columns, 'like', "%$value%");
            })
        ]);

        return $qb->paginate();
    }
}
