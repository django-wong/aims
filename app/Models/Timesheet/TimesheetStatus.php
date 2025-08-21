<?php

namespace App\Models\Timesheet;

use App\Models\Timesheet;

abstract class TimesheetStatus
{
    protected Timesheet $context;

    public function __construct(Timesheet $context)
    {
        $this->context = clone $context;
    }

    /**
     * Get the next status in the workflow.
     *
     * @return TimesheetStatus|null
     */
    abstract public function next(): ?TimesheetStatus;

    /**
     * Get the previous status in the workflow.
     *
     * @return TimesheetStatus|null
     */
    abstract public function prev(): ?TimesheetStatus;

    /**
     * Transition the timesheet to this status.
     */
    abstract public function transition(Timesheet $timesheet): void;
}
