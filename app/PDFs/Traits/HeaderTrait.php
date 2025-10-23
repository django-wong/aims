<?php

namespace App\PDFs\Traits;

trait HeaderTrait
{
    public function Header()
    {
        $this->Image(public_path('logo.png'), 15, 10, '', 15);
        $this->SetFont('helvetica', 'B', 20);
        $this->Cell(0, 15, '<< TCPDF Example 003 >>', 0, false, 'L', 0, '', 0, false, 'C', 'M');
        $this->Line(15, 28, $this->getPageWidth() - 15, 28);
    }

    public function Footer()
    {
        $this->SetY(-15);
        $this->SetFont('helvetica', 'I', 8);
        $this->Cell(0, 10, 'Page ' . $this->getAliasNumPage() . '/' . $this->getAliasNbPages(), 0, false, 'C', 0, '', 0, false, 'T', 'M');
    }
}
