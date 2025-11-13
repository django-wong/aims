<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int    $id
 * @property string $name
 * @property string $timezone
 * @property ?Address  $address
 */
class Org extends Model implements CurrentOrg, Invoiceable
{
    /** @use HasFactory<\Database\Factories\OrgFactory> */
    use HasFactory, HasManyAssignments, BelongsToAddress, SoftDeletes;

    protected $guarded = [
        'id'
    ];

    public static function current(): ?self
    {
        return auth()->user()->org;
    }

    public function getInvoiceName(): string
    {
        return $this->billing_name ?? $this->name;
    }

    public function getInvoiceAddress(): ?string
    {
        return $this->billing_address ?? $this->address->full_address ?? null;
    }
}
