<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class Invoice extends FromQueryBuilder implements WithHeadings, WithMapping, WithColumnFormatting
{
    use Exportable, DynamicProperties;

    public string $fileName = 'invoices.csv';

    public function headings(): array
    {
        return [
            'ID',
            'Invoice To',
            'Status',
            'Project',
            'Purchase Order',
            'Hours',
            'Travel Distance',
            'Expenses',
            'Invoice Amount',
            'Created At',
        ];
    }

    public function map($row): array
    {
        return [
            $row->id,
            $row->invoiceable->name ?? $row->invoiceable->business_name ?? '',
            \App\Models\Invoice::describeStatus($row->status),
            $row->project_title ?? '',
            $row->purchase_order_title ?? '',
            $row->hours,
            sprintf('%s%s', $row->travel_distance, $row->travel_unit),
            $row->expenses,
            $row->cost,
            $row->created_at->format('d/m/Y H:i:s'),
        ];
    }

    public function columnFormats(): array
    {
        return [
            'J' => NumberFormat::FORMAT_TEXT
        ];
    }
}
