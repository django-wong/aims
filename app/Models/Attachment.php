<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * @property Model $attachable
 */
class Attachment extends Model implements \Illuminate\Contracts\Mail\Attachable
{
    /** @use HasFactory<\Database\Factories\AttachmentFactory> */
    use HasFactory, DynamicPagination;

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

    public static function store(UploadedFile $file, Attachable $attachable)
    {
        return $attachable->attachments()->create(
            static::upload(
                $file, for: $attachable
            )
        );
    }

    public static function upload(UploadedFile $file, Attachable $for): array
    {
        return [
            'name' => $file->getClientOriginalName(),
            'disk' => config('filesystems.default'),
            'path' => $file->storePublicly($for->getPathPrefix() . '/' . $for->getKey() . '/attachments', config('filesystems.default')),
            'size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ];
    }

    public function revision(UploadedFile $file)
    {
        $revision = $this->revisions()->create(
            $this->only([
                'name',
                'disk',
                'path',
                'size',
                'mime_type',
            ])
        );

        $data = static::upload($file, for: $this->attachable);

        $this->update($data);

        return $revision;
    }

    public function download()
    {
        return Storage::disk($this->disk)->download($this->path, $this->name, [
            'Content-Type' => $this->mime_type,
            'Content-Length' => $this->size,
        ]);
    }

    public function revisions()
    {
        return $this->hasMany(AttachmentRevision::class);
    }

    public function toMailAttachment(): \Illuminate\Mail\Attachment
    {
        return \Illuminate\Mail\Attachment::fromStorageDisk($this->disk, $this->path)->as($this->name)->withMime($this->mime_type);
    }
}
