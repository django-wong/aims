<?php

namespace App\Jobs;

use App\Models\Assignment;
use App\Models\AssignmentInspector;
use App\Models\Org;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Queue\Queueable;

class UpcomingAssignmentReminder implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(private readonly Org|null $org = null)
    {
        Assignment::query()->tap(function (Builder $query) {
            if ($this->org) {
                $query->where('org_id', $this->org->id);
            }
        })->whereDate('first_visit_date', now()->addDay()->format('Y-m-d'))->each(function (Assignment $assignment) {
            $assignment->assignment_inspectors->each(function (AssignmentInspector $inspector) use ($assignment) {
                try {
                    $inspector->user->notify(
                        new \App\Notifications\UpcomingAssignmentReminderForInspector(
                            $assignment, $inspector
                        )
                    );
                } catch (\Exception $e) {
                    \Log::error("Failed to send notification to inspector ID {$inspector->id} for assignment ID {$assignment->id}: " . $e->getMessage());
                }
            });
        });
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        //
    }
}
