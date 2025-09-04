<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Gate;

/**
 * @property string $role
 * @property int    $org_id
 * @property Org  $org
 */
class UserRole extends Model
{
    /** @use HasFactory<\Database\Factories\UserRoleFactory> */
    use HasFactory, BelongsToOrg, BelongsToUser;

    const SYSTEM = 1; // Reserved for system admin
    const ADMIN = 2;
    const FINANCE = 3;
    const PM = 4; // PM and Staff should have same permissions
    const INSPECTOR = 5;
    const CLIENT = 6;
    const VENDOR = 7;
    const STAFF = 8;

    protected $guarded = [
        'id', 'created_at', 'updated_at',
    ];

    protected static function booted()
    {

    }

    static public function current(): UserRole|null
    {
        return auth()->user()->role ?? null;
    }

    public function isAnyOf($roles, ...$args): bool
    {
        if (!is_array($roles)) {
            $roles = array_merge([$roles], $args);
        }

        return in_array($this->role ?? null, $roles, true);
    }
}
