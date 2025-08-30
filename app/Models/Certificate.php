<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property mixed $user
 */
class Certificate extends Model
{
    /** @use HasFactory<\Database\Factories\CertificateFactory> */
    use HasFactory, SoftDeletes, DynamicPagination, BelongsToUser;

    protected $fillable = [
        'user_id',
        'certificate_type_id',
        'certificate_technique_id',
        'certificate_level_id',
        'title',
        'issued_at',
        'expires_at',
    ];

    protected $casts = [
        'issued_at' => 'date',
        'expires_at' => 'date',
    ];

    public function certificate_type(): BelongsTo
    {
        return $this->belongsTo(CertificateType::class);
    }

    public function certificate_technique(): BelongsTo
    {
        return $this->belongsTo(CertificateTechnique::class);
    }

    public function certificate_level(): BelongsTo
    {
        return $this->belongsTo(CertificateLevel::class);
    }
}
