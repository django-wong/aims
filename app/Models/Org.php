<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int    $id
 * @property string $name
 * @property string  $timezone
 */
class Org extends Model
{
    /** @use HasFactory<\Database\Factories\OrgFactory> */
    use HasFactory, HasManyAssignments, BelongsToAddress;

    protected $guarded = [
        'id'
    ];

    public static function current(): ?self
    {
        return auth()->user()->org;
    }
}
