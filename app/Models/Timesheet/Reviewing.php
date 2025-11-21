<?php

namespace App\Models\Timesheet;

use App\Models\Timesheet;
use Lab404\Impersonate\Services\ImpersonateManager;

/**
 * Timesheet is submitted by the inspector and is waiting for operation office approval.
 */
class Reviewing implements Status
{
    public function next(Timesheet $timesheet): ?string
    {
        return Approved::class;
    }

    public function prev(Timesheet $timesheet): ?string
    {
        return Draft::class;
    }

    public function transition(Timesheet $timesheet): void
    {
        $on_behalf = null;
        $user = auth()->user();
        if ($user?->isImpersonated()) {
            $on_behalf = $user?->name;
            $user = app(ImpersonateManager::class)->getImpersonator();
        }

        if (empty($timesheet->signed_off_at)) {
            $timesheet->signed_off_by = $user?->name;
            $timesheet->signed_off_at = now();
            $timesheet->save();
            foreach ([$timesheet, $timesheet->assignment] as $subject) {
                activity()
                    ->by($user)
                    ->on($subject)
                    ->withProperties($timesheet->getChanges())->log(
                        'Signed off timesheet' . ($on_behalf ? " on behalf of {$on_behalf}" : '')
                    );
            }
        }

        $timesheet->status = Timesheet::REVIEWING;
        $timesheet->save();

        $assignment = $timesheet->assignment;

        $coordinator = $assignment->operation_coordinator ?? $assignment->coordinator;

        if (request()->has('signature_base64')) {
            $timesheet->signatures()->updateOrCreate(
                ['timesheet_id' => $timesheet->id],
                ['inspector_signature' => request()->input('signature_base64')]
            );
        }

        if ($coordinator) {
            $coordinator->notify(
                new \App\Notifications\TimesheetSubmitted($timesheet)
            );
        }
    }
}
