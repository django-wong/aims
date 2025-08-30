<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CertificateTechnique extends Model
{
    /** @use HasFactory<\Database\Factories\CertificateTechniqueFactory> */
    use HasFactory, DynamicPagination;

    protected $guarded = [
        'id'
    ];
}
