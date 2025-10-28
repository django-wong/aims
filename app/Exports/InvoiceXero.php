<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class InvoiceXero extends FromQueryBuilder implements WithHeadings, WithMapping
{
    use Exportable, DynamicProperties;

    public string $fileName = 'xero-invoices.csv';

    public function headings(): array
    {
        return [
            '*ContactName',
            'EmailAddress',
            'POAddressLine1',
            'POAddressLine2',
            'POAddressLine3',
            'POAddressLine4',
            'POCity',
            'PORegion',
            'POPostalCode',
            'POCountry',
            '*InvoiceNumber',
            'Reference',
            '*InvoiceDate',
            '*DueDate',
            'Total',
            'InventoryItemCode',
            '*Description',
            '*Quantity',
            '*UnitAmount',
            'Discount',
            '*AccountCode',
            '*TaxType',
            'TaxAmount',
            'TrackingName1',
            'TrackingOption1',
            'TrackingName2',
            'TrackingOption2',
            'Currency',
            'BrandingTheme',
        ];
    }

    public function map($row): array
    {
        return [
            $row->invoiceable->business_name ?? $row->invoiceable->name ?? 'Unknown', // contact name, required
            $row->invoiceable->email ?? '', // email address
            '', // po address line 1
            '', // po address line 2
            '', // po address line 3
            '', // po address line 4
            '', // po city
            '', // po region
            '', // po postal code
            '', // po country
            $row->getGeneratedId(), // invoice number, required
            $row->purchase_order_title ?? '', // reference
            $row->created_at->format('d/m/Y'), // invoice date, required
            $row->created_at->add('30 days')->format('d/m/Y'), // due date, required
            '', // $row->total_cost, // total
            '', // inventory item code
            'Invoice #' . $row->id, // description, required
            1, // quantity, required
            $row->total_cost, // unit amount, required
            '', // discount
            '200', // account code, required
            'VAT', // tax type, required
            $row->tax_rate ? ($row->tax_rate / 100) * $row->total_cost : 0, // tax amount
            '', // tracking name 1
            '', // tracking option 1
            '', // tracking name 2
            '', // tracking option 2
            $row->purchase_order->currency, // currency
            '', // branding theme
        ];
    }
}
