<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\TimesheetReports\IndexRequest;
use App\Http\Requests\APIv1\TimesheetReports\StoreTimesheetReportRequest;
use App\Http\Requests\APIv1\TimesheetReports\UpdateTimesheetReportRequest;
use App\Models\Attachment;
use App\Models\TimesheetReport;
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
        return $this->getQueryBuilder()->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTimesheetReportRequest $request)
    {
        $report = TimesheetReport::query()->create($request->validated());

        Attachment::store(
            file: $request->file('attachment'),
            attachable: $report
        );

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
    public function update(UpdateTimesheetReportRequest $request, TimesheetReport $timesheetReport)
    {
        $request->file('attachment');

        /**
         * @var Attachment $attachment
         */
        $attachment = $timesheetReport->attachments()->first();

        $revision = $attachment->revision($request->file('attachment'));

        return [
            'message' => 'You have successfully updated the timesheet report attachment.',
            'data' => $timesheetReport,
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TimesheetReport $timesheetReport)
    {
        //
    }
}
