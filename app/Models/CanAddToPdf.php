<?php

namespace App\Models;

use setasign\Fpdi\Tcpdf\Fpdi;

trait CanAddToPdf
{
    public function onto(Fpdi $pdf)
    {
        $path = $this->tmpPath();
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);
        $pdf->setMargins(15, 15, 15);

        switch ($this->mime_type) {
            case 'image/jpeg':
            case 'image/png':
                $pdf->AddPage('P');
                $pdf->Image($path, 15, 30, $pdf->getPageWidth() - 30);
                break;
            case  'application/pdf':
                $pdf->setMargins(0, 0, 0);
                $pageCount = $pdf->setSourceFile($path);
                for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
                    $tplIdx = $pdf->importPage($pageNo);
                    $size = $pdf->getTemplateSize($tplIdx);
                    $orientation = ($size['width'] > $size['height']) ? 'L' : 'P';
                    $pdf->AddPage($orientation);
                    $pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
                }
                break;
            case 'image/gif':
                // GIFs are not directly supported; convert to PNG first
                $image = imagecreatefromgif($path);
                $tempPath = storage_path('app/temp/' . uniqid() . '.png');
                imagepng($image, $tempPath);
                imagedestroy($image);

                $pdf->AddPage('P');
                $pdf->Image($tempPath, 15, 15, $pdf->getPageWidth() - 30);

                unlink($tempPath); // Clean up temporary file
                break;
            default:
                // Unsupported type; skip embedding
                break;
        }

        unlink($path);
    }
}
