<x-pdf.layout>
    <x-pdf.header>
        <table style="width: 100%; margin: 0; padding: 0; border: none; border-collapse: collapse;">
            <tr>
                <td style="height: 100%; vertical-align: bottom;" class="left">
                    Invoice #{{$invoice->id}} - {{$invoice->purchase_order_title}}</td>
            </tr>
        </table>
    </x-pdf.header>
    <x-pdf.footer/>
    <img
        style="height: 100px; width: auto" src="{{ public_path('logo.png') }}"
    />
    <h1 style="font-size: 24px; font-weight: bold; text-align: left;">
        B.I.E Quality Services Pte Ltd
    </h1>
    <p style="font-size: 16px; font-weight: bold; text-align: left">TAX INVOICE</p>

    <x-pdf.table>
        <x-pdf.table.row>
            <td style="width: 50%;">
                <p style="font-weight: bold">TO:</p>
                <p>{{ $invoice->invoiceable->getInvoiceName() }}</p>
                <p>{{ $invoice->invoiceable->getInvoiceAddress() }}</p>
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
    <table style="width: 100%;">
        <tr>
            <td colspan="2" style="background-color: #eee; font-weight: bold">DESCRIPTION</td>
        </tr>
        <tr>
            <td colspan="2" style="font-weight: bold">INSPECTION</td>
        </tr>
        <tr>
            <td>{{ $invoice->hours }} hr</td>
            <td style="text-align: right">{{ $invoice->currency }} @money($invoice->hour_cost)</td>
        </tr>
        <tr>
            <td colspan="2" style="font-weight: bold">Mileage</td>
        </tr>
        <tr>
            <td>{{ $invoice->travel_distance }} {{ $invoice->travel_unit }}</td>
            <td style="text-align: right">{{ $invoice->currency }} @money($invoice->travel_cost)</td>
        </tr>
        <tr>
            <td colspan="2" style="text-align: right; font-weight: bold; background-color: #eee;">
                {{ $invoice->currency }} @money($invoice->hour_cost + $invoice->travel_cost)
            </td>
        </tr>
        <tr>
            <td colspan="2" style="font-weight: bold">Expenses</td>
        </tr>
        <tr>
            <td colspan="2" style="text-align: right; font-weight: bold; background-color: #eee;">
                {{ $invoice->currency }} @money($invoice->expenses)
            </td>
        </tr>
        @if($invoice->is_client_invoice)
            <tr>
                <td colspan="2" style="text-align: right;">
                    {{ $invoice->process_fee_rate }}% Process Fee (on Expenses) {{ $invoice->currency }} @money($invoice->process_fee)
                </td>
            </tr>
        @else
            <tr>
                <td colspan="2" style="text-align: right;">
                    Less {{ $invoice->commission_rate }}% Intercompany Discount (on Hours) {{ $invoice->currency }} @money($invoice->commission)
                </td>
            </tr>
        @endif
        <tr>
            <td colspan="2" style="background-color: #ccc; text-align: right; font-weight: bold;">
                TOTAL {{ $invoice->currency }} @money($invoice->final_cost)
            </td>
        </tr>
    </table>

    @php $timesheets = \App\Models\Timesheet::query()->invoice($invoice)->get(); @endphp
    @foreach($timesheets as $index => $timesheet)
        <x-pdf.page-break/>
        <x-timesheet :timesheet="$timesheet"/>
    @endforeach
</x-pdf.layout>
