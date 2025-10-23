<?php

namespace App\PDFs;

use App\Models\InvoiceDetail;

class Invoice extends BasePDF
{
    public function __construct(public \App\Models\Invoice $invoice)
    {
        parent::__construct();
    }

    public function render()
    {
        $data = [
            'invoice' => InvoiceDetail::query()->find($this->invoice->id)
        ];

        $this->AddPage();
        $this->writeHTML(
            view('pdfs.invoice', $data)->render()
        );

        $this->AddPage('L');
        $this->writeHTML(
            view('pdfs.invoice-breakdown', $data)->render()
        );
    }
}
