<?php

namespace App\Http\Requests\APIv1;

use App\Support\ModelResolver;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateAttachmentRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'attachment' => 'file',
        ];
    }

    public function authorize(): bool
    {
        $attachable = $this->route('attachment')->attachable;

        if (empty($attachable)) {
            return false;
        }

        return Gate::allows('create', [\App\Models\Attachment::class, $attachable]);
    }
}
