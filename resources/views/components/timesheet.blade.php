@props([
    'timesheet'
])

@php
$inspector = \App\Models\AssignmentInspector::query()->with('assignment_type')->where([
    'assignment_id' => $timesheet->assignment_id,
    'user_id' => $timesheet->user_id,
])->first();

$assignment = \App\Models\AssignmentDetail::query()->find($timesheet->assignment_id);
@endphp
<table cellpadding="2">
    <tr>
        <td style="width: 75%; text-align: left; vertical-align: top;">
            <h1 style="font-size: 22px; font-weight: bold; line-height: 18px;">TIMESHEET</h1>
            <p><strong>Assignment No:</strong> {{$assignment->id}} <br><strong>Inspector:</strong> {{$timesheet->user->name}} <br><strong>Discipline:</strong> {{$inspector->assignment_type->name}} <br><strong>Vendor / Sub vendor:</strong> {{$assignment->main_vendor_name}} / {{$assignment->sub_vendor_name}}</p>
        </td>
        <td style="width: 25%; text-align: center; vertical-align: top;">
            @if($assignment->project->client->logo_url)
                <img style="height: 100px; width: auto" src="{{ $assignment->project->client->logo_url }}"/>
            @else
                For {{ $assignment->project->client->business_name }}
            @endif
        </td>
    </tr>
</table>

<p></p>

<x-pdf.table class="table" style="margin-bottom: 20px;">
    <x-pdf.table.row>
        <x-pdf.table.cell style="font-weight: bold">Date</x-pdf.table.cell>
        <x-pdf.table.cell style="text-align: center; font-weight: bold">Hours</x-pdf.table.cell>
        <x-pdf.table.cell style="text-align: center; font-weight: bold">Travel ({{$assignment?->purchase_order?->travel_unit ?? 'km'}})</x-pdf.table.cell>
        <x-pdf.table.cell style="text-align: center; font-weight: bold">Expenses ({{$assignment?->purchase_order?->currency}})</x-pdf.table.cell>
    </x-pdf.table.row>
    @foreach($timesheet->timesheet_items as $item)
    <x-pdf.table.row>
        <x-pdf.table.cell>{{$item->date->format('d-m-Y')}}</x-pdf.table.cell>
        <x-pdf.table.cell style="text-align: center">{{$item->hours}}</x-pdf.table.cell>
        <x-pdf.table.cell style="text-align: center">{{$item->travel_distance}} {{$item->travel_unit}}</x-pdf.table.cell>
        <x-pdf.table.cell style="text-align: center">{{ $timesheet->currency }} @money($item->total_expense)</x-pdf.table.cell>
    </x-pdf.table.row>
    @endforeach
    <x-pdf.table.row>
        <x-pdf.table.cell style="font-weight: bold">Total</x-pdf.table.cell>
        <x-pdf.table.cell style="text-align: center">{{$timesheet->hours}}</x-pdf.table.cell>
        <x-pdf.table.cell style="text-align: center">{{$timesheet->travel_distance}}</x-pdf.table.cell>
        <x-pdf.table.cell style="text-align: center">{{$timesheet->expenses}}</x-pdf.table.cell>
    </x-pdf.table.row>
</x-pdf.table>

<p></p>

<x-pdf.table class="table">
    <x-pdf.table.row style="font-weight: bold">
        <x-pdf.table.cell style="font-weight: bold">Place</x-pdf.table.cell>
        <x-pdf.table.cell style="font-weight: bold">Date</x-pdf.table.cell>
        <x-pdf.table.cell style="font-weight: bold">Inspector</x-pdf.table.cell>
    </x-pdf.table.row>
    <x-pdf.table.row>
        <x-pdf.table.cell>{{ $assignment->vendor?->name }}</x-pdf.table.cell>
        <x-pdf.table.cell>{{$timesheet->signed_off_at?->format('d-m-Y')}}</x-pdf.table.cell>
        <x-pdf.table.cell>
            <p>Print Name: {{$timesheet->user->name}}</p>
            <p>Signed:  <br>
            @if(! empty($timesheet->signatures->inspector_signature))
                <img style="height: 75px; width: auto" src="{{ $timesheet->signatures->inspector_signature }}"/>
            @endif</p>
        </x-pdf.table.cell>
    </x-pdf.table.row>
    <x-pdf.table.row style="font-weight: bold">
        <x-pdf.table.cell style="font-weight: bold">Place</x-pdf.table.cell>
        <x-pdf.table.cell style="font-weight: bold">Date</x-pdf.table.cell>
        <x-pdf.table.cell style="font-weight: bold">Reviewed and Approved By</x-pdf.table.cell>
    </x-pdf.table.row>
    <x-pdf.table.row>
        <x-pdf.table.cell>{{ $assignment->operation_org->name ?? $assignment->org->name ?? '' }}</x-pdf.table.cell>
        <x-pdf.table.cell>{{$timesheet->approved_at?->format('d-m-Y')}}</x-pdf.table.cell>
        <x-pdf.table.cell>
            <p>Print Name: {{ $assignment->operation_coordinator?->name ?? $assignment->coordinator?->name ?? ''}}</p>
            <p>Signed: <br>
            @if(! empty($timesheet->signatures?->coordinator_signature))
                <img style="height: 75px; width: auto" src="{{ $timesheet->signatures?->coordinator_signature }}"/>
            @endif</p>
        </x-pdf.table.cell>
    </x-pdf.table.row>

    <x-pdf.table.row style="font-weight: bold">
        <x-pdf.table.cell style="font-weight: bold">Place</x-pdf.table.cell>
        <x-pdf.table.cell style="font-weight: bold">Date</x-pdf.table.cell>
        <x-pdf.table.cell style="font-weight: bold">Reviewed and Approved By {{$assignment->project->client->client_group}}</x-pdf.table.cell>
    </x-pdf.table.row>
    <x-pdf.table.row>
        <x-pdf.table.cell>{{ $assignment->project->client->business_name }}</x-pdf.table.cell>
        <x-pdf.table.cell>{{$timesheet->client_approved_at?->format('d-m-Y')}}</x-pdf.table.cell>
        <x-pdf.table.cell>
            <p>Print Name: {{$assignment->project->client?->user?->name}}</p>
            <p>Signed:  <br>
            @if(! empty($timesheet->signatures?->client_signature))
                <img style="height: 75px; width: auto" src="{{ $timesheet->signatures?->client_signature }}"/>
            @endif</p>
        </x-pdf.table.cell>
    </x-pdf.table.row>
</x-pdf.table>
