<?php

namespace App\Policies;

use App\Models\Expense;
use App\Models\Invoice;
use App\Models\TimesheetItem;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Gate;

class ExpensePolicy
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
    public function view(User $user, Expense $expense): bool
    {
        return $this->update($user, $expense);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, TimesheetItem $timesheetItem): bool
    {
        $org = $timesheetItem->timesheet->assignment->operation_org_id ?? $timesheetItem->timesheet->assignment->org_id;
        if ($user->org->id == $org) {
            return Gate::allows('create', Invoice::class) || $user->can('inspect', $timesheetItem->timesheet->assignment);
        }
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Expense $expense): bool
    {
        return $user->user_role->org_id === $expense->timesheet->assignment->org_id && Gate::allows('create', Invoice::class);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Expense $expense): bool
    {
        return $this->update($user, $expense);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Expense $expense): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Expense $expense): bool
    {
        return false;
    }
}
