<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\RejectNotificationOfInspectionRequest;
use App\Http\Requests\APIv1\StoreNotificationOfInspectionRequest;
use App\Http\Requests\APIv1\UpdateNotificationOfInspectionRequest;
use App\Models\CurrentOrg;
use App\Models\NotificationOfInspection;
use App\Notifications\NotificationOfInspectionAcceptedByClient;
use App\Notifications\NotificationOfInspectionAcceptedByCoordinator;
use App\Notifications\NotificationOfInspectionRejectedByClient;
use App\Notifications\NotificationOfInspectionRejectedByCoordinator;
use App\Notifications\NotificationOfInspectionRequestedByClient;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class NotificationOfInspectionController extends Controller
{
    public function index(CurrentOrg $org)
    {
        return $this->getQueryBuilder()->tap(function (Builder $query) use ($org) {
            $query->leftJoin('assignments', function (JoinClause $join) {
                $join->on(
                    'assignments.id',
                    '=',
                    'notification_of_inspections.assignment_id'
                );
            });
            $query->leftJoin('users', function (JoinClause $join) {
                $join->on(
                    'users.id',
                    '=',
                    'notification_of_inspections.inspector_id');
            });
            $query->leftJoin('clients', function (JoinClause $join) {
                $join->on(
                    'clients.id',
                    '=',
                    'notification_of_inspections.client_id'
                );
            });

            $query->select([
                'notification_of_inspections.*', 'assignments.reference_number as reference_number', 'users.name as inspector_name', 'clients.business_name as client_business_name',
            ]);

            if (Auth::isClient()) {
                $query->where('notification_of_inspections.client_id', Auth::user()->client->id);
            } else {
                $query->where(function (Builder $query) use ($org) {
                    $query->where('notification_of_inspections.org_id', $org->id)->where('notification_of_inspections.status', '>', NotificationOfInspection::DRAFT);
                });
            }
        })->paginate();
    }

    public function store(StoreNotificationOfInspectionRequest $request, CurrentOrg $org)
    {
        $noi = DB::transaction(function () use ($request, $org) {
            /**
             * @var NotificationOfInspection $noi
             */
            $noi = NotificationOfInspection::query()->create($request->validated() + [
                'client_id' => $request->user()->client->id,
                'org_id' => $org->id,
            ]);

            $request->saveAttachments($noi);

            return $noi;
        });

        activity()->on($noi)->log('Created Notification of Inspection');

        return [
            'data' => $noi,
            'message' => 'Notification of Inspection created successfully.',
        ];
    }

    public function update(UpdateNotificationOfInspectionRequest $request, NotificationOfInspection $notification_of_inspection)
    {
        Gate::authorize('update', $notification_of_inspection);

        $notification_of_inspection->update($request->validated());

        activity()->on($notification_of_inspection)->withProperties($notification_of_inspection->getChanges())->log('Updated Notification of Inspection');

        return [
            'message' => 'Notification of Inspection updated successfully.',
            'data' => $notification_of_inspection,
        ];
    }

    public function accept(Request $request, NotificationOfInspection $notification_of_inspection)
    {

        Gate::authorize('accept', $notification_of_inspection);

        $notification_of_inspection->status = $request->user()->client?->is($notification_of_inspection->client)
            ? NotificationOfInspection::CLIENT_ACCEPTED
            : NotificationOfInspection::ACCEPTED;

        // Replace proposed date if available
        if ($notification_of_inspection->proposed_from) {
            $notification_of_inspection->from = $notification_of_inspection->proposed_from;
            $notification_of_inspection->proposed_from = null;
        }

        if ($notification_of_inspection->proposed_to) {
            $notification_of_inspection->to = $notification_of_inspection->proposed_to;
            $notification_of_inspection->proposed_to = null;
        }

        $notification_of_inspection->save();

        activity()->on($notification_of_inspection)->log('Accepted');

        if ($notification_of_inspection->status === NotificationOfInspection::CLIENT_ACCEPTED) {
            $user = $notification_of_inspection->assignment->operation_coordinator;
            $cc = $notification_of_inspection->assignment->coordinator;
            if ($cc && empty($user)) {
                [$user, $cc] = [$cc, null];
            }
            if ($user) {
                $user->notify(
                    new NotificationOfInspectionAcceptedByClient($notification_of_inspection, $cc)
                );
            }
        }

        if ($notification_of_inspection->status === NotificationOfInspection::ACCEPTED) {
            $notification_of_inspection->client->notify(
                new NotificationOfInspectionAcceptedByCoordinator($notification_of_inspection)
            );
        }

        return [
            'message' => 'Notification of Inspection accepted.',
            'data' => $notification_of_inspection,
        ];
    }

    public function reject(RejectNotificationOfInspectionRequest $request, NotificationOfInspection $notification_of_inspection)
    {
        Gate::authorize('reject', $notification_of_inspection);

        $notification_of_inspection->status = $request->user()->client?->is($notification_of_inspection->client)
            ? NotificationOfInspection::CLIENT_REJECTED
            : NotificationOfInspection::REJECTED;

        $notification_of_inspection->fill($request->validated());
        $notification_of_inspection->save();

        $reason = $request->input('rejection_reason', 'n/a');

        if ($notification_of_inspection->status === NotificationOfInspection::CLIENT_REJECTED) {
            $user = $notification_of_inspection->assignment->operation_coordinator;
            $cc = $notification_of_inspection->assignment->coordinator;
            if ($cc && empty($user)) {
                [$user, $cc] = [$cc, null];
            }
            if ($user) {
                $user->notify(
                    new NotificationOfInspectionRejectedByClient($notification_of_inspection, $cc)
                );
            }
        }

        if ($notification_of_inspection->status === NotificationOfInspection::REJECTED) {
            $notification_of_inspection->client->notify(
                new NotificationOfInspectionRejectedByCoordinator($notification_of_inspection)
            );
        }

        activity()->on($notification_of_inspection)->log("Rejected with reason: <{$reason}>");

        return [
            'message' => 'Notification of Inspection rejected.',
            'data' => $notification_of_inspection,
        ];
    }

    public function send(Request $request, NotificationOfInspection $notification_of_inspection)
    {
        Gate::authorize('send', $notification_of_inspection);

        if (in_array($notification_of_inspection->status, [NotificationOfInspection::DRAFT, NotificationOfInspection::REQUESTED])) {
            $notification_of_inspection->status = NotificationOfInspection::REQUESTED;
            $notification_of_inspection->save();
        }

        $user = $notification_of_inspection->assignment->operation_coordinator;
        $cc = $notification_of_inspection->assignment->coordinator;

        if ($cc && empty($user)) {
            [$user, $cc] = [$cc, null];
        }

        if ($user) {
            $user->notify(
                new NotificationOfInspectionRequestedByClient(
                    $notification_of_inspection, $cc
                )
            );
            activity()->byAnonymous()->on($notification_of_inspection)->log(
                sprintf('Notification sent to <%s>, and ccd <%s>', $user->name, $cc?->name ?? 'nobody')
            );
        }

        return [
            'message' => 'Notification of Inspection sent successfully.',
            'data' => $notification_of_inspection,
        ];
    }
}
