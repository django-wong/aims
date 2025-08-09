<?php

namespace App\Models;

use App\Notifications\NewAssignmentIssued;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\App;


/**
 * @property User    $inspector
 * @property Project $project
 * @property int   $inspector_id
 */
class Assignment extends Model implements Commentable
{
    /** @use HasFactory<\Database\Factories\AssignmentFactory> */
    use HasFactory, BelongsToOrg, DynamicPagination, BelongsToProject, BelongsToVendor, HasManyComments, HasManyTimesheets;

    protected $guarded = [
        'id', 'created_at', 'updated_at', 'deleted_at'
    ];

    protected function casts(): array
    {
        return [
            'report_required' => 'boolean'
        ];
    }

    protected static function booted()
    {
        static::created(function (self $assignment) {
            if ($assignment->inspector_id) {
                $assignment->inspector->notify(
                    new NewAssignmentIssued($assignment)
                );
            }
        });
    }

    public function operation_org(): BelongsTo
    {
        return $this->belongsTo(Org::class, 'operation_org_id');
    }

    public function assignment_type(): BelongsTo
    {
        return $this->belongsTo(AssignmentType::class, 'assignment_type_id');
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
                $query->where('inspector_id', auth()->id());
            }
        });
    }

    public function inspector(): BelongsTo
    {
        return $this->belongsTo(
            User::class, 'inspector_id'
        );
    }

    public function sub_vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class, 'sub_vendor_id');
    }
}
