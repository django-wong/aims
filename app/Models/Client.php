<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Query\Builder as QueryBuilder;

/**
 * @property integer   $org_id
 * @property User|null $coordinator
 * @property int|null  $address_id
 * @property User      $user
 * @property User|null $reviewer
 * @property Org       $org
 * @property int       $id
 */
class Client extends Model implements Contactable, Invoiceable, Commentable
{
    /** @use HasFactory<\Database\Factories\ClientFactory> */
    use HasFactory, DynamicPagination, BelongsToOrg, BelongsToUser, HasManyContact, BelongsToAddress, HasManyContact;
    use HasManyComments;

    protected $guarded = [
        'id', 'updated_at', 'created_at'
    ];

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function coordinator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'coordinator_id');
    }

    public function getInvoiceName(): string
    {
        return $this->billing_name ?? $this->business_name;
    }

    public function getInvoiceAddress(): ?string
    {
        return $this->billing_address ?? $this->address->full_address ?? null;
    }

    public function scopeVisible(Builder $query, ?User $user = null)
    {
        $user = $user ?? auth()->user();

        if ($user->isRole(UserRole::INSPECTOR)) {
            $query->whereIn('id', function (QueryBuilder $query) use ($user) {
                $query->select('client_id')
                    ->from('projects')
                    ->whereRaw(
                        'id in (select project_id from assignments left join assignment_inspectors ai on assignments.id = ai.assignment_id where ai.user_id = ?)', [$user->id]
                    );
            });
        }

        if ($user->isRole(UserRole::CLIENT)) {
            $query->whereRaw('1 = 2');
        }


        $query->where(function (Builder $query) use ($user) {
            $query->where('org_id', $user->org->id)
                ->orWhereRaw(
                    'id in (select client_id from projects left join assignments on projects.id = assignments.project_id where assignments.operation_org_id = ?)',
                    [$user->org->id]
                );
        });
    }
}
