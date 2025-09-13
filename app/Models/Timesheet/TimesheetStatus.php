<?php

namespace App\Models\Timesheet;

use App\Models\Timesheet;

class TimesheetStatus
{
    static public function current(Timesheet $timesheet): Status
    {
        return match($timesheet->status) {
            Timesheet::DRAFT => new Draft(),
            Timesheet::REVIEWING => new Reviewing(),
            Timesheet::APPROVED => new Approved(),
            // Timesheet::CONTRACT_HOLDER_APPROVED => new ContractHolderApproved(),
            Timesheet::CLIENT_APPROVED => new ClientApproved(),
            Timesheet::INVOICED => new Invoiced()
        };
    }

    static public function make(Timesheet $timesheet): TimesheetStatus
    {
        return new self($timesheet);
    }

    protected Status $current;

    public function __construct(private Timesheet $timesheet)
    {
        $this->current = static::current($timesheet);
    }

    public function prev(): ?Status
    {
        $class = $this->current->prev($this->timesheet);

        if ($class) {
            return new $class();
        }

        return null;
    }

    public function next(): ?Status
    {
        $class = $this->current->next($this->timesheet);

        if ($class) {
            return new $class();
        }

        return null;
    }

    public function is(string $status): bool
    {
        return $this->current instanceof $status;
    }

    public function __get(string $name)
    {
        if (property_exists($this, $name)) {
            return $this->$name;
        }

        if (property_exists($this->current, $name)) {
            return $this->current->$name;
        }

        throw new \Exception("Property {$name} does not exist on " . static::class . " or " . get_class($this->current));
    }
}
