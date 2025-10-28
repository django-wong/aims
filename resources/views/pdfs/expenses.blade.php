@php $timesheets = \App\Models\Timesheet::query()->invoice($invoice)->get(); @endphp

@php
    $expenses = \App\Models\Expense::query()->whereIn(
        'expenses.timesheet_item_id', \App\Models\TimesheetItem::query()->whereIn(
            'timesheet_id', \App\Models\Timesheet::query()->invoice($invoice)->select('id')
        )->select('id')
    )->get();
@endphp

<table>
    <tr>
        <td style="width: auto; text-align: center; font-size: 24px; vertical-align: center; font-weight: bold">
            <span style="font-size: 12px">BIE GROUP</span>
            <br>
            Expense Summary
        </td>
    </tr>
</table>

<p></p>

<table cellpadding="4px">
    <tr style="font-weight: bold">
        <td style="width: 20%; border: 1px solid #000; background-color: #dbdbd7">INVOICE NO.</td>
        <td style="width: 10%; border: 1px solid #000; background-color: #dbdbd7">CREDITOR</td>
        <td style="width: 20%; border: 1px solid #000; background-color: #dbdbd7">DESCRIPTION</td>
        <td style="width: 10%; border: 1px solid #000; background-color: #dbdbd7">DATE</td>
        <td style="width: 10%; border: 1px solid #000; background-color: #dbdbd7">INSPECTOR</td>
        <td style="width: 10%; border: 1px solid #000; background-color: #dbdbd7">NET AMOUNT</td>
        <td style="width: 5%; border: 1px solid #000; background-color: #dbdbd7">GST</td>
        <td style="width: 10%; border: 1px solid #000; background-color: #dbdbd7">FEES (GST Free)</td>
        <td style="width: 5%; border: 1px solid #000; background-color: #dbdbd7">TOTAL</td>
    </tr>
    @foreach($expenses as $expense)
    <tr>
        <td style="border: 1px solid #000;">{{$expense->invoice_number}}</td>
        <td style="border: 1px solid #000;">{{$expense->creditor}}</td>
        <td style="border: 1px solid #000;">{{$expense->description}}</td>
        <td style="border: 1px solid #000;">{{$expense->timesheet_item->date->format('d/m/Y')}}</td>
        <td style="border: 1px solid #000;">{{$expense->timesheet->user->name}}</td>
        <td style="border: 1px solid #000;">@money($expense->net_amonut)</td>
        <td style="border: 1px solid #000;">@money($expense->gst)</td>
        <td style="border: 1px solid #000;">@money($expense->process_fee)</td>
        <td style="border: 1px solid #000;">@money($expense->amount)</td>
    </tr>
    @endforeach
</table>
