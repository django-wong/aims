<?php

namespace App\PDFs;

class Timesheet extends BasePDF
{
    /**
     * @param Timesheet $timesheet
     */
    public function __construct(private \App\Models\Timesheet $timesheet)
    {
        parent::__construct();
    }

    public function Header()
    {
        parent::Header();
        $this->SetFont('helvetica', '', 12);
        $this->SetXY($this->getPageWidth() - 60, 10);
        $this->Cell(0, 15, '#' . $this->timesheet->id, 0, false, 'R', 0);
    }

    public function render()
    {
        $this->AddPage('L', 'A4');
        $this->writeHTML(
            view('pdfs.timesheet', ['timesheet' => $this->timesheet])->render()
        );
    }
}
