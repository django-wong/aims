<?php

namespace App\Models;

use App\Notifications\NewAssignmentIssued;
use Illuminate\Database\Eloquent\Builder;
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
 */
class Assignment extends Model implements Commentable, Attachable
{
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
            'expediting' => 'boolean',
            'audit' => 'boolean',
            'exit_call' => 'boolean',
            'flash_report' => 'boolean',
            'status' => 'boolean',
            'first_visit_date' => 'date',
        ];
    }

    protected static function booted()
    {
        // $no_self_delegate = function (self $assignment) {
        //     if ($assignment->operation_org_id && $this->operation_org_id === $this->org_id) {
        //         throw new \Exception(
        //             'You cannot delegate an assignment to the contract holder\'s own organization.'
        //         );
        //     }
        // };
        //
        // static::updating($no_self_delegate);
        // static::creating($no_self_delegate);
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

            $query->whereAny(
                ['operation_org_id', 'org_id'], $id
            );

            if (auth()->user()->isRole(UserRole::INSPECTOR)) {
                $query->whereHas('assignment_inspectors', function (Builder $q) {;
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

        return $next_reference;
    }
}
