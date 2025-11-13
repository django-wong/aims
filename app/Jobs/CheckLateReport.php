<?php

namespace App\Jobs;

use App\Models\Assignment;
use App\Models\Org;
use App\Models\Timesheet;
use App\Notifications\AssignmentReportLate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class CheckLateReport implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(private Org $org)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $assignments = Assignment::query()->where(function ($query) {
            $query->whereRaw("assignments.org_id = ? and assignments.close_date is null", [$this->org->id]);
        });

        $assignments->each(function (Assignment $assignment) {
            $assignment->assignment_inspectors->each(function ($inspector) use ($assignment) {
                /**
                 * @var Timesheet|null $timesheet
                 */
                $start_of_last_week = now($this->org->timezone)->subWeek()->startOfWeek();
                $timesheet = $assignment->timesheets()->where('user_id', $inspector->user_id)->whereDate('start', $start_of_last_week)->first();

                // If timesheet exists and is not draft, and has inspection report, then it's good
                if ($timesheet) {
                    if ($timesheet->status > Timesheet::DRAFT) {
                        if ($timesheet->timesheet_reports()->where('type', 'inspection-report')->exists()) {
                            return;
                        }
                    }
                }

                // Otherwise, mark as late and notify coordinator
                if (empty($timesheet)) {
                    $timesheet = $assignment->timesheets()->create([
                        'user_id' => $inspector->user_id,
                        'org_id' => $this->org->id,
                        'late' => true,
                        'start' => $start_of_last_week,
                        'end' => $start_of_last_week->copy()->endOfWeek(),
                        'status' => Timesheet::DRAFT,
                    ]);
                }

                $timesheet->update(['late' => true]);

                $assignment->coordinator->notify(
                    new AssignmentReportLate($assignment, $inspector, $timesheet)
                );
            });
        });
    }
}
