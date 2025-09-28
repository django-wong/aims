<table class="base-table">
    <tr>
        <td>Project</td>
        <td>
            {{ $invoice->project_title }}
        </td>
    </tr>
    <tr>
        <td>Work Order</td>
        <td>
            {{ $invoice->purchase_order_title }}
        </td>
    </tr>
    <tr>
        <td>Date Range</td>
        <td>{{ $invoice->start->format('Y-m-d') }} to {{ $invoice->end->format('Y-m-d') }}</td>
    </tr>
    <tr>
        <td>Hours</td>
        <td>{{ $invoice->hours }}</td>
    </tr>
    <tr>
        <td>Travel Distance</td>
        <td>{{ $invoice->travel_distance }}{{ $invoice->travel_unit }}</td>
    </tr>
    <tr>
        <td>Expenses</td>
        <td>${{ number_format($invoice->expenses, 2) }}</td>
    </tr>
</table>
