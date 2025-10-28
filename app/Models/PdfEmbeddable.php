<?php

namespace App\Models;

use setasign\Fpdi\Tcpdf\Fpdi;

interface PdfEmbeddable
{
    public function onto(Fpdi $pdf);
}
