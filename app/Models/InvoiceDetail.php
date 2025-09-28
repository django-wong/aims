<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class InvoiceDetail extends Invoice
{
    use DynamicPagination;

    protected function casts(): array
    {
        return [
            'start' => 'date',
            'end' => 'date',
        ];
    }
}
