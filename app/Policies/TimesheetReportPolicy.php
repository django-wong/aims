<?php

namespace App\Policies;

use App\Models\Timesheet;
use App\Models\Timesheet\TimesheetStatuses;
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
    public function create(User $user, Timesheet $timesheet): bool
    {
        return $user->can('update', $timesheet);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, TimesheetReport $timesheetReport): bool
    {
        if ($user->can('inspect', $timesheetReport->timesheet->assignment)) {
            return $timesheetReport->timesheet->status === TimesheetStatuses::DRAFT;
        }

        return $user->can(
            'update', $timesheetReport->timesheet
        );
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, TimesheetReport $timesheetReport): bool
    {
        return $this->update($user, $timesheetReport);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, TimesheetReport $timesheetReport): bool
    {
        return $this->update($user, $timesheetReport);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, TimesheetReport $timesheetReport): bool
    {
        return false;
    }
}
