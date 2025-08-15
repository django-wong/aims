<?php

namespace App\Http\Requests\APIv1\Contacts;

use App\Models\Contactable;
use Illuminate\Support\Facades\Gate;
use function App\Support\useModel;

class StoreRequest extends \Illuminate\Foundation\Http\FormRequest
{
    public function contactable(): Contactable|null
    {
        $id = $this->input('contactable_id');
        $model = useModel($this->input('contactable_type'));
        return $model::query()->find($id);
    }

    public function authorize(): bool
    {
        return Gate::allows('update', $this->contactable());
    }

    public function rules(): array
    {
        return [
            'contactable_id' => ['required', 'integer'],
            'contactable_type' => ['required', 'string'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'mobile' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'string', 'url', 'max:255'],
            'business_type' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string']
        ];
    }

    public function basic(): array
    {
        return $this->only([
            'first_name',
            'last_name',
            'title',
            'email',
            'mobile',
            'phone',
            'company',
            'website',
            'notes',
            'business_type',
        ]);
    }
}
