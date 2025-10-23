<?php

namespace App\PDFs;

use App\PDFs\Traits\HeaderTrait;
use setasign\Fpdi\Tcpdf\Fpdi;

abstract class BasePDF extends Fpdi
{
    public function Header()
    {
        $this->Image(public_path('logo.png'), 15, 10, '', 15);
        $this->Line(15, 30, $this->getPageWidth() - 15, 30);
    }

    public function Footer()
    {
        $this->SetY(-15);
        $this->SetFont('helvetica', 'I', 8);
        $this->Cell(0, 10, 'Page ' . $this->getAliasNumPage() . '/' . $this->getAliasNbPages(), 0, false, 'C', 0, '', 0, false, 'T', 'M');
    }

    public function __construct()
    {
        parent::__construct();
        $this->init();
    }

    public function init() {
        $this->setMargins(15, 35, 15, false);
        $this->setFontSize(8);
    }

    abstract public function render();
}
