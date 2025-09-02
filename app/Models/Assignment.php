<?php

namespace App\Models;

use App\Notifications\NewAssignmentIssued;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\App;


/**
 * @property Project       $project
 * @property int|null      $operation_org_id
 * @property int           $org_id
 * @property Org           $org
 * @property Org|null      $operation_org
 * @property PurchaseOrder $purchase_order
 * @property mixed         $id
 * @property int|mixed     $status
 * @property User|null     $operation_coordinator
 * @property string        $reference_number
 * @property Collection<Attachment>         $attachments
 */
class Assignment extends Model implements Commentable, Attachable
{
    const DRAFT = 0; // This assignment is a draft and has not been issued to an operation org
    const ISSUED = 1; // This assignment has been issued to an operation org
    const REJECTED = 2; // The operation org rejected the assignment for a reason
    const ACCEPTED = 3; // The operation org accepted the assignment and will continue to assign the work to their inspectors
    const ASSIGNED = 4; // The assignment has been assigned to an inspector
    const PARTIAL_ACKED = 5; // One or more inspectors have acknowledged the assignment
    const ACKED = 6; // The inspector has acknowledged the assignment
    // Reserved states for future use
    const OPEN = 7; // The inspector has started the assignment
    const CLOSED = 8; // The inspector has completed the assignment


    /** @use HasFactory<\Database\Factories\AssignmentFactory> */
    use HasFactory, BelongsToOrg, DynamicPagination, BelongsToProject, BelongsToVendor, HasManyComments, HasManyTimesheets, BelongsToPurchaseOrder;
    use BelongsToAssignmentType, HasManyAssignmentInspectors, HasManyAttachments, BelongsToSkill;

    protected $guarded = [
        'id', 'created_at', 'updated_at', 'deleted_at'
    ];

    protected function casts(): array
    {
        return [
            'report_required' => 'boolean',
            'pre_inspection_meeting' => 'boolean',
            'final_inspection' => 'boolean',
            'dimensional' => 'boolean',
            'sample_inspection' => 'boolean',
            'witness_of_tests' => 'boolean',
            'monitoring' => 'boolean',
            'packing' => 'boolean',
            'document_review' => 'boolean',
            'send_report_to' => 'integer',
            'expediting' => 'boolean',
            'delegated' => 'boolean',
            'audit' => 'boolean',
            'exit_call' => 'boolean',
            'flash_report' => 'boolean',
            'close_date' => 'date',
            'is_closed' => 'boolean',
            'first_visit_date' => 'date',
        ];
    }

    public function operation_org(): BelongsTo
    {
        return $this->belongsTo(Org::class, 'operation_org_id');
    }

    public function scopeVisible(Builder $query, Org|null|int $to = null)
    {
        return $query->where(function (Builder $query) use ($to) {
            $id = $to instanceof Org ? $to->id : $to;
            if (is_null($id)) {
                $id = auth()->user()->org->id;
            }

            // $query->whereAny(
            //     ['operation_org_id', 'org_id'], $id
            // );

            $query->where(function (Builder $query) use ($id) {
                $query->where('org_id', $id)->orWhere(function (Builder $query) use ($id) {
                    $query->where('operation_org_id', $id)->where('status', '>=', self::ISSUED);
                });
            });

            if (auth()->user()->isRole(UserRole::INSPECTOR)) {
                $query->whereHas('assignment_inspectors', function (Builder $q) {
                    ;
                    $q->where('user_id', auth()->user()->id);
                });
            }
        });
    }

    public function sub_vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class, 'sub_vendor_id');
    }

    public function visit_contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class, 'visit_contact_id');
    }

    public static function nextAssignmentNumber(): string
    {
        $year = date('Y');
        $org = auth()->user()->org;
        $region = $org->code ?? 'AUS'; // Default to 'AUS' if the region code is not set

        $last_appointment = Assignment::query()->whereYear('created_at', $year)
            ->where('org_id', $org->id)
            ->orderBy('id', 'desc')
            ->first();

        $last_number = 1;
        if ($last_appointment) {
            preg_match('/(\d+)$/', $last_appointment->reference_number, $matches);
            if (isset($matches[1])) {
                $last_number = (int)$matches[1];
            }
        }

        $iteration = 0;

        AGAIN:
        $iteration++;
        if ($iteration > 1000) {
            throw new \Exception('Unable to generate a unique assignment reference number after 1000 attempts.');
        }
        $next_number = $last_number + 1;
        $next_reference = sprintf('%s-%s-%04d', $year, $region, $next_number);

        $exists = Assignment::query()->where('reference_number', $next_reference)->exists();

        if ($exists) {
            $last_number = $next_number;
            goto AGAIN;
        }

        return $next_reference; // e.g., "2024-AUS-0001"
    }

    public function coordinator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'coordinator_id');
    }

    public function operation_coordinator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'operation_coordinator_id');
    }
}
