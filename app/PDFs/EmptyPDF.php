<?php


namespace App\PDFs;

class EmptyPDF extends BasePDF
{
    public function __construct()
    {
        parent::__construct();
    }

    public function render()
    {
        // Not implemented
    }
}
