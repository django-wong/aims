@php $timesheets = \App\Models\Timesheet::query()->invoice($invoice)->get(); @endphp
<table style="padding-bottom: 15px">
    <tr>
        <td style="font-size: 24px; font-weight: bold; text-align: left; margin-bottom: 20px">Invoice Breakdown</td>
    </tr>
</table>
<x-pdf.table>
    <x-pdf.table.row>
        <x-pdf.table.cell :head="true">REF</x-pdf.table.cell>
        <x-pdf.table.cell :head="true">Client PO</x-pdf.table.cell>
        <x-pdf.table.cell :head="true">Main / Sub vendor</x-pdf.table.cell>
        <x-pdf.table.cell :head="true">Discipline</x-pdf.table.cell>
        <x-pdf.table.cell :head="true">Project</x-pdf.table.cell>
        <x-pdf.table.cell :head="true">REP No.</x-pdf.table.cell>
        <x-pdf.table.cell :head="true">Inspector</x-pdf.table.cell>
        <x-pdf.table.cell :head="true">Hrs</x-pdf.table.cell>
        <x-pdf.table.cell :head="true">Rate</x-pdf.table.cell>
        <x-pdf.table.cell :head="true">Total Cost</x-pdf.table.cell>
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
        <x-pdf.table.cell>Total</x-pdf.table.cell>
        <x-pdf.table.cell></x-pdf.table.cell>
        <x-pdf.table.cell></x-pdf.table.cell>
        <x-pdf.table.cell></x-pdf.table.cell>
        <x-pdf.table.cell></x-pdf.table.cell>
        <x-pdf.table.cell></x-pdf.table.cell>
        <x-pdf.table.cell></x-pdf.table.cell>
        <x-pdf.table.cell>{{$invoice->hours}}</x-pdf.table.cell>
        <x-pdf.table.cell></x-pdf.table.cell>
        <x-pdf.table.cell>@money($invoice->hour_cost)</x-pdf.table.cell>
    </x-pdf.table.row>
</x-pdf.table>

