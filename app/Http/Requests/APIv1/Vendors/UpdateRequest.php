<?php

namespace App\Http\Requests\APIv1\Vendors;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends StoreRequest
{
    public function rules(): array
    {
        return [
            'name' => 'string|max:255',
            'business_name' => 'max:255',
            'notes' => 'nullable|string|max:1000',
            'address' => 'nullable|array',
            'address.country' => 'string|max:255',
            'address.state' => 'string|max:255',
            'address.city' => 'string|max:255',
            'address.zip' => 'string|max:255',
            'address.address_line_1' => 'string|max:255',
            'address.address_line_2' => 'nullable|string|max:255',
            'address.address_line_3' => 'nullable|string|max:255',
        ];
    }
}
