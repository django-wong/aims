<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CertificateLevel extends Model
{
    /** @use HasFactory<\Database\Factories\CertificateLevelFactory> */
    use HasFactory, DynamicPagination;

    protected $guarded = [
        'id',
    ];
}
