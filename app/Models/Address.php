<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    /** @use HasFactory<\Database\Factories\AddressFactory> */
    use HasFactory;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    protected $appends = [
        'full_address',
    ];

    public function getFullAddressAttribute(): string
    {
        $addressParts = [
            $this->address_line_1,
            $this->address_line_2,
            $this->address_line_3,
            $this->city,
            $this->state,
            $this->zip,
            $this->country,
        ];

        return implode(', ', array_filter($addressParts));
    }
}
