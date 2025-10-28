<?php

namespace App\Models;

trait GeneratedInvoiceID
{
    public function getGeneratedId()
    {
        return 'INV-'.str_pad($this->id, 8, '0', STR_PAD_LEFT);
    }
}
