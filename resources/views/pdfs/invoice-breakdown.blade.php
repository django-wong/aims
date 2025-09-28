@php $timesheets = \App\Models\Timesheet::query()->invoice($invoice)->get(); @endphp

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

    <h1 style="font-size: 24px; font-weight: bold; text-align: left;">
        Invoice Breakdown
    </h1>

    <table class="table">
        <tr>
            <td class="head">REF</td>
            <td class="head">Client PO</td>
            <td class="head">Vendor / Sub vendor</td>
            <td class="head">Discipline</td>
            <td class="head">Project</td>
            <td class="head">REP No.</td>
            <td class="head">Inspector</td>
            <td class="head">Hrs</td>
            <td class="head">Rate</td>
            <td class="head">Total Cost</td>
        </tr>
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
            <tr>
                <td>{{$timesheet->assignment->reference_number}}</td>
                <td>{{$timesheet->assignment->client_po ?? 'N/A'}}</td>
                <td>{{$timesheet->assignment->vendor?->name}}/{{$timesheet->assignment->sub_vendor?->name}}</td>
                <td>{{$inspector->assignment_type->name}}</td>
                <td>{{$timesheet->assignment->project?->title}}</td>
                <td>{{$timesheet->inspection_report?->report_no}}</td>
                <td>{{$timesheet->user?->name}}</td>
                <td>{{$timesheet->hours}}</td>
                <td>@money($budget->hourly_rate)</td>
                <td>@money($timesheet->hour_cost)</td>
            </tr>
        @endforeach
        <tr class="head">
            <td>Total</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>{{$invoice->hours}}</td>
            <td></td>
            <td>@money($invoice->hour_cost)</td>
        </tr>
    </table>
</x-pdf.layout>

