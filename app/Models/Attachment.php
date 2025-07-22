<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Attachment extends Model
{
    /** @use HasFactory<\Database\Factories\AttachmentFactory> */
    use HasFactory;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function attachable(): MorphTo
    {
        return $this->morphTo();
    }

    protected function url(): Attribute
    {
        return Attribute::make(
            get: fn () => Storage::disk($this->disk)->url($this->path),
        );
    }

    public static function upload(UploadedFile $file, Attachable $for)
    {
        return $for->attachments()->create([
            'name' => $file->getClientOriginalName(),
            'disk' => config('filesystems.default'),
            'path' => $file->storePublicly($for->getPathPrefix() . '/' . $for->getKey() . '/attachments', config('filesystems.default')),
            'size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ]);
    }

    public function download()
    {
        return Storage::disk($this->disk)->download($this->path, $this->name, [
            'Content-Type' => $this->mime_type,
            'Content-Length' => $this->size,
        ]);
    }
}
