<?php

namespace App\Http\Controllers\APIv1;

use App\Models\HoursEntry;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class ReportController
{
    //
    public function hours_entry(Request $request)
    {
        return HoursEntry::query()->tap(function (Builder $query) use ($request) {
            match ($request->input('type')) {
                'local' => $query->where('org_id', $request->user()->user_role->org_id),
                'others' => $query->where('org_id', '!=', $request->user()->user_role->org_id),
                default => null,
            };
        })->paginate();
    }
}
