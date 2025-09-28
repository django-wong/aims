<?php

namespace App\Http\Requests\APIv1;

use Illuminate\Foundation\Http\FormRequest;

class RejectInvoiceRequest extends FormRequest
{
  public function rules(): array
  {
    return [
      'rejection_reason' => 'required|string|max:1000',
    ];
  }
}
