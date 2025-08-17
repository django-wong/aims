<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\TimesheetItems\StoreRequest;
use App\Models\Attachment;
use App\Models\Timesheet;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Spatie\QueryBuilder\AllowedFilter;
use function Aws\filter;

class TimesheetController extends Controller
{
    protected function allowedIncludes()
    {
        return [
            'assignment',
            'assignment.project',
            'assignment.project.client',
            'timesheet_items',
            'timesheet_items.user'
        ];
    }

    protected function allowedFilters()
    {
        return [
            'assignment_id',
            'hours',
            'travel_distance',
            AllowedFilter::callback('keywords', function (Builder $query, $value) {

            })
        ];
    }

    protected function allowedSorts()
    {
        return [
            'id',
            'created_at',
            'hours',
            'travel_distance',
        ];
    }

    public function index(Request $request)
    {
        Gate::authorize('viewAny', Timesheet::class);

        return $this->getQueryBuilder()->defaultSort('-created_at')
            ->paginate();
    }


    public function show(Timesheet $timesheet)
    {
        return response()->json([
            'data' => $timesheet->load([
                'assignment', 'assignment.project', 'assignment.project.client', 'timesheet_items', 'timesheet_items.user'
            ])
        ]);
    }

    public function destroy(Timesheet $timesheet)
    {
        return response()->json([
            'data' => $timesheet->delete()
        ]);
    }
}
