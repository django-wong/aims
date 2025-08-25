<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttachmentRevision extends Model
{
    /** @use HasFactory<\Database\Factories\AttachmentRevisionFactory> */
    use HasFactory;

    protected $guarded = [
        'id', 'attachment_id'
    ];

    public function attachment()
    {
        return $this->belongsTo(Attachment::class);
    }
}
