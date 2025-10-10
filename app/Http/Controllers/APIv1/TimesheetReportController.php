<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\TimesheetReports\IndexRequest;
use App\Http\Requests\APIv1\TimesheetReports\StoreTimesheetReportRequest;
use App\Http\Requests\APIv1\TimesheetReports\UpdateTimesheetReportRequest;
use App\Models\Attachment;
use App\Models\TimesheetReport;
use Illuminate\Support\Facades\Gate;
use Spatie\QueryBuilder\AllowedFilter;

class TimesheetReportController extends Controller
{

    protected function allowedFilters()
    {
        return [
            AllowedFilter::exact('type')
        ];
    }

    protected function allowedIncludes()
    {
        return [
            'timesheet', 'attachment'
        ];
    }

    protected function allowedSorts()
    {
        return [
            'created_at',
            'type'
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(IndexRequest $request)
    {
        return $this->getQueryBuilder()->where('timesheet_id', $request->input('timesheet_id'))->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTimesheetReportRequest $request)
    {
        $report = TimesheetReport::query()->create([
            ...$request->validated(),
            'visit_date' => $request->validated('visit_date', now()),
            'raised_by' => $request->user()->name,
        ]);

        $attachment = Attachment::store(
            file: $request->file('attachment'),
            attachable: $report
        );

        activity()->on($request->timesheet())->withProperties([
            'attachments' => [
                $attachment->toArray()
            ]
        ])->log('Uploaded report');

        return [
            'message' => 'Timesheet report created successfully.',
            'data' => $report,
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(TimesheetReport $timesheetReport)
    {
        return [
            'data' => $timesheetReport,
        ];
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTimesheetReportRequest $request, TimesheetReport $timesheet_report)
    {
        /**
         * @var Attachment $attachment
         */
        $attachment = $timesheet_report->attachments()->first();

        if ($file = $request->file('attachment')) {
            $attachment->revision($file);
            $timesheet_report->closed_or_rev_by_id = $request->user()->id;
            $timesheet_report->rev_date = now();
            $timesheet_report->rev = $attachment->revisions()->count();
        }

        $timesheet_report->update($request->validated());

        return [
            'message' => 'You have successfully updated the timesheet report attachment.',
            'data' => $timesheet_report->refresh(),
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TimesheetReport $timesheetReport)
    {
        Gate::authorize('delete', $timesheetReport);

        $timesheetReport->delete();

        return [
            'message' => 'You have successfully deleted the timesheet report.',
        ];
    }
}
