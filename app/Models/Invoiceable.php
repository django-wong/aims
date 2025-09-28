<?php

namespace App\Models;

interface Invoiceable
{
    public function getInvoiceName(): string;
    public function getInvoiceAddress(): ?string;
}
