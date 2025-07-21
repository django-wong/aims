<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $guarded = [
        'id', 'created_at', 'updated_at', 'deleted_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn(mixed $value) => $value,
            set: fn(string $value) => [
                'first_name' => explode(' ', $value)[0] ?? '',
                'last_name' => explode(' ', $value, 2)[1] ?? '',
            ]
        );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * The org that the user belongs to. Reserves the capability for multi-tenant applications
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOneThrough
     */
    public function org()
    {
        return $this->hasOneThrough(
            Org::class, UserRole::class, 'user_id', 'id', 'id', 'org_id'
        );
    }

    public function scopeOfOrg(Builder $query, Org|int $org)
    {
        if ($org instanceof Org) {
            $org = $org->id;
        }

        return $query->whereIn(
            'id', function (QueryBuilder $query) use ($org) {
                $query->select('user_id')->from('user_roles')->where('org_id', $org);
            }
        );
    }

    public function user_role()
    {
        return $this->hasOne(
            UserRole::class, 'user_id', 'id'
        );
    }
}
