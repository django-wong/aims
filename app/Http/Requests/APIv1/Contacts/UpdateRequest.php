<?php

namespace App\Http\Requests\APIv1\Contacts;

use App\Models\Contact;
use App\Models\Contactable;
use Illuminate\Support\Facades\Gate;

class UpdateRequest extends StoreRequest
{
    public function rules(): array
    {
        $rules = parent::rules();

        unset($rules['contactable_id']);
        unset($rules['contactable_type']);

        return $rules;
    }

    public function authorize(): bool
    {
        return Gate::allows(
            'update', $this->route('contact')
        );
    }


    public function contactable(): Contactable|null
    {
        return $this->route('contact')->contactable;
    }
}
