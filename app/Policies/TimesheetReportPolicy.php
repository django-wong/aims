<?php

namespace App\Policies;

use App\Models\Timesheet;
use App\Models\TimesheetReport;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TimesheetReportPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, TimesheetReport $timesheetReport): bool
    {
        return $user->can('view', $timesheetReport->timesheet);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Timesheet|null $timesheet = null): bool|Response
    {
        if ($timesheet) {
            return $user->can('update', $timesheet);
        }

        return $user->can('update', $user->user_role->org);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, TimesheetReport $timesheet_report): bool|Response
    {
        if ($user->can('inspect', $timesheet_report->timesheet->assignment)) {
            if ($timesheet_report->timesheet->status !== Timesheet::DRAFT) {
                return Response::deny(
                    'Timesheet is submitted and cannot be modified.'
                );
            }
            return true;
        }

        return $user->can(
            'update', $timesheet_report->timesheet
        );
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, TimesheetReport $timesheet_report): bool|Response
    {
        return $this->update($user, $timesheet_report);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, TimesheetReport $timesheet_report): bool
    {
        return $this->update($user, $timesheet_report);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, TimesheetReport $timesheet_report): bool
    {
        return false;
    }
}
