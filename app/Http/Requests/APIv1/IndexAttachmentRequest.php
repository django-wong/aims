<?php

namespace App\Http\Requests\APIv1;

use App\Support\ModelResolver;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class IndexAttachmentRequest extends FormRequest
{
    private Model $attachable;

    public function authorize(): bool
    {
        return Gate::allows('view', $this->attachable());
    }

    public function rules(): array
    {
        return [
            'attachable_type' => ['string', 'max:255'],
            'attachable_id' => ['required', 'numeric'],
        ];
    }

    public function attachable(): ?\App\Models\Attachable
    {
        if (empty($this->attachable)) {
            $type = $this->input('attachable_type');
            $id = $this->input('attachable_id');

            $model = ModelResolver::for($type);

            $this->attachable = $model::find($id);
        }

        return $this->attachable;
    }
}
