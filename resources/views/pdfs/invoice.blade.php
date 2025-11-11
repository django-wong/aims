<h1 style="font-size: 24px; font-weight: bold; text-align: left;">{{ $invoice->title ?? $invoice->org->billing_name ?? 'B.I.E Quality Services Pte Ltd' }}</h1>
<h6 style="font-size: 16px; font-weight: bold; text-align: left">{{ $invoice->sub_title ?? ($invoice->org->abn ? 'ABN: '.$invoice->org->abn : null) ?? 'INVOICE' }}</h6>
<x-pdf.table cellpadding="2">
    <x-pdf.table.row>
        <td style="width: 50%;">
            <p style="font-weight: bold">TO:</p>
            <p>{{ $invoice->billing_name ?? $invoice->invoiceable->getInvoiceName() }}</p>
            <p>{{ $invoice->billing_address ?? $invoice->invoiceable->getInvoiceAddress() }}</p>
        </td>
        <td style="text-align: right">
            <p><strong>INVOICE DATE:</strong> {{ $invoice->created_at->format('d-m-Y') }}</p>
            <p><strong>INVOICE NUMBER:</strong> INV-{{$invoice->invoice_number}}-{{ $invoice->id }}</p>
        </td>
    </x-pdf.table.row>
    <x-pdf.table.row>
        <td style="width: 50%">
            <p style="font-weight: bold">FROM:</p>
            <p>{{ $invoice->org->name }}</p>
            <p>{{ $invoice->org->address?->full_address ?? '' }}</p>
        </td>
        <td></td>
    </x-pdf.table.row>
</x-pdf.table>

<x-pdf.table cellpadding="2">
    <x-pdf.table.row>
        <td colspan="2" style="background-color: #eee; font-weight: bold; line-height: 25px">DESCRIPTION</td>
    </x-pdf.table.row>
    <x-pdf.table.row>
        <td colspan="2" style="font-weight: bold">INSPECTION</td>
    </x-pdf.table.row>
    <x-pdf.table.row>
        <td>{{ $invoice->hours }} hr</td>
        <td style="text-align: right">{{ $invoice->currency }} @money($invoice->hour_cost)</td>
    </x-pdf.table.row>
    <x-pdf.table.row>
        <td colspan="2" style="font-weight: bold">Travel</td>
    </x-pdf.table.row>
    <x-pdf.table.row>
        <td>{{ $invoice->travel_distance }} {{ $invoice->travel_unit }}</td>
        <td style="text-align: right">{{ $invoice->currency }} @money($invoice->travel_cost)</td>
    </x-pdf.table.row>
    <x-pdf.table.row>
        <td colspan="2" style="text-align: right; font-weight: bold; background-color: #eee;">
            {{ $invoice->currency }} @money($invoice->hour_cost + $invoice->travel_cost)
        </td>
    </x-pdf.table.row>
    <x-pdf.table.row>
        <td colspan="2" style="font-weight: bold">Expenses</td>
    </x-pdf.table.row>
    <x-pdf.table.row>
        <td colspan="2" style="text-align: right; font-weight: bold; background-color: #eee;">
            {{ $invoice->currency }} @money($invoice->expenses)
        </td>
    </x-pdf.table.row>
    @if($invoice->is_client_invoice)
        <x-pdf.table.row>
            <td colspan="2" style="text-align: right;">
                {{ $invoice->process_fee_rate }}% Process Fee (on Expenses) {{ $invoice->currency }} @money($invoice->process_fee)
            </td>
        </x-pdf.table.row>
    @else
        <x-pdf.table.row>
            <td colspan="2" style="text-align: right;">
                Less {{ $invoice->commission_rate }}% Intercompany Discount (on Hours) {{ $invoice->currency }} @money($invoice->commission)
            </td>
        </x-pdf.table.row>
    @endif
    <x-pdf.table.row>
        <td colspan="2" style="background-color: #ccc; text-align: right; font-weight: bold;">
            TOTAL {{ $invoice->currency }} @money($invoice->total_cost)
        </td>
    </x-pdf.table.row>
</x-pdf.table>

@if(! empty($invoice->notes))
    <p>@foreach(explode("\n", $invoice->notes) as $line){{ $line }} <br>@endforeach</p>
@endif

@if(! empty($invoice->org->billing_statement))
    <p><strong>Bank Details</strong></p>
    <p>@foreach(explode("\n", $invoice->org->billing_statement) as $line){{ $line }} <br>@endforeach</p>
@endif
