<?php

namespace App\PDFs;

use App\Models\Attachment;
use App\Models\Expense;
use App\Models\InvoiceDetail;

class Invoice extends BasePDF
{
    public function __construct(public \App\Models\Invoice $invoice)
    {
        parent::__construct();
    }

    public function Header()
    {
        parent::Header();
        // Add text "Invoice" to the header on the right side
        $this->SetFont('helvetica', '', 12);
        $this->SetXY($this->getPageWidth() - 60, 10);
        $this->Cell(50, 10, $this->invoice->getGeneratedId(), 0, 0, 'R');
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

        $this->AddPage('L');
        $this->writeHTML(
            view('pdfs.expenses', $data)->render()
        );

        $timesheets = \App\Models\Timesheet::query()->invoice($this->invoice)->get();

        foreach ($timesheets as $timesheet) {
            $this->AddPage('L', 'A4');
            $this->writeHTML(
                view('pdfs.timesheet', ['timesheet' => $timesheet])->render()
            );

            $attachments = Attachment::query()->where('attachable_type', Expense::class)->whereIn('attachable_id', Expense::query()->where('timesheet_id', $timesheet->id)->select('id'))->get();
            foreach ($attachments as $attachment) {
                if ($attachment->isEmbeddable()) {
                    $attachment->onto($this);
                }
            }
        }
    }
}
