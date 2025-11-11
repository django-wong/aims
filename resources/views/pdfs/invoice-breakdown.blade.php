@php $timesheets = \App\Models\Timesheet::query()->invoice($invoice)->get(); @endphp

<table>
    <tr>
        <td style="width: auto; text-align: center; font-size: 24px; vertical-align: center; font-weight: bold">
            <span style="font-size: 12px">BIE GROUP</span>
            <br>
            Invoice Breakdown
        </td>
    </tr>
</table>

<p></p>

<x-pdf.table>
    <x-pdf.table.row>
        <x-pdf.table.cell style="width: 13%; font-weight: bold; background-color: #ccc">BIE: IA#</x-pdf.table.cell>
        <x-pdf.table.cell style="width: 10%; font-weight: bold; background-color: #ccc">WO</x-pdf.table.cell>
        <x-pdf.table.cell style="width: 10%; font-weight: bold; background-color: #ccc">Client PO</x-pdf.table.cell>
        <x-pdf.table.cell style="width: 10%; font-weight: bold; background-color: #ccc">Main / Sub vendor</x-pdf.table.cell>
        <x-pdf.table.cell style="width: 10%; font-weight: bold; background-color: #ccc">Discipline</x-pdf.table.cell>
        <x-pdf.table.cell style="width: 10%; font-weight: bold; background-color: #ccc">Project</x-pdf.table.cell>
        <x-pdf.table.cell style="width: 10%; font-weight: bold; background-color: #ccc">REP No.</x-pdf.table.cell>
        <x-pdf.table.cell style="width: 10%; font-weight: bold; background-color: #ccc">Inspector</x-pdf.table.cell>
        <x-pdf.table.cell style="width: 5%; font-weight: bold; background-color: #ccc">Hrs</x-pdf.table.cell>
        <x-pdf.table.cell style="width: 5%; font-weight: bold; background-color: #ccc">Rate*</x-pdf.table.cell>
        <x-pdf.table.cell style="width: 7%; font-weight: bold; background-color: #ccc">Total Cost</x-pdf.table.cell>
    </x-pdf.table.row>
    @foreach($timesheets as $timesheet)
        @php
        $inspector = \App\Models\AssignmentInspector::query()->with('assignment_type')->where([
            'assignment_id' => $timesheet->assignment_id,
            'user_id' => $timesheet->user_id,
        ])->first();
        $budget = \App\Models\Budget::query()->where([
            'purchase_order_id' => $timesheet->assignment->purchase_order_id,
            'assignment_type_id' => $inspector->assignment_type_id,
        ])->first();
        @endphp
        <x-pdf.table.row>
            <x-pdf.table.cell>{{$timesheet->assignment->reference_number}}</x-pdf.table.cell>
            <x-pdf.table.cell>{{$timesheet->assignment->purchase_order->title ?? 'N/A'}}</x-pdf.table.cell>
            <x-pdf.table.cell>{{$timesheet->assignment->client_po ?? 'N/A'}}</x-pdf.table.cell>
            <x-pdf.table.cell>{{$timesheet->assignment->vendor?->name}}/{{$timesheet->assignment->sub_vendor?->name}}</x-pdf.table.cell>
            <x-pdf.table.cell>{{$inspector->assignment_type->name}}</x-pdf.table.cell>
            <x-pdf.table.cell>{{$timesheet->assignment->project?->title}}</x-pdf.table.cell>
            <x-pdf.table.cell>{{$timesheet->inspection_report?->report_no}}</x-pdf.table.cell>
            <x-pdf.table.cell>{{$timesheet->user?->name}}</x-pdf.table.cell>
            <x-pdf.table.cell>{{$timesheet->hours}}</x-pdf.table.cell>
            <x-pdf.table.cell>@money($budget->hourly_rate)</x-pdf.table.cell>
            <x-pdf.table.cell>@money($timesheet->hour_cost)</x-pdf.table.cell>
        </x-pdf.table.row>
    @endforeach
    <x-pdf.table.row class="head">
        <x-pdf.table.cell style="font-weight: bold">Total</x-pdf.table.cell>
        <x-pdf.table.cell style="font-weight: bold"></x-pdf.table.cell>
        <x-pdf.table.cell style="font-weight: bold"></x-pdf.table.cell>
        <x-pdf.table.cell style="font-weight: bold"></x-pdf.table.cell>
        <x-pdf.table.cell style="font-weight: bold"></x-pdf.table.cell>
        <x-pdf.table.cell style="font-weight: bold"></x-pdf.table.cell>
        <x-pdf.table.cell style="font-weight: bold"></x-pdf.table.cell>
        <x-pdf.table.cell style="font-weight: bold"></x-pdf.table.cell>
        <x-pdf.table.cell style="font-weight: bold">{{$invoice->hours}}</x-pdf.table.cell>
        <x-pdf.table.cell style="font-weight: bold"></x-pdf.table.cell>
        <x-pdf.table.cell style="font-weight: bold">@money($invoice->hour_cost)</x-pdf.table.cell>
    </x-pdf.table.row>
</x-pdf.table>

<p>* The rate may vary depending on the inspector discipline.</p>
