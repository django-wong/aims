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

<x-pdf.table class="table">
    <tr>
        <td rowspan="2" style="width: 25%; text-align: center;">
            <img style="height: 100px; width: auto" src="{{ public_path('logo.png') }}"/>
        </td>
        <td colspan="2" style="width: 50%; text-align: center; font-size: 24px; font-weight: bold">TIMESHEET</td>
        <td rowspan="2" style="width: 25%; text-align: center;">
            @if($assignment->project->client->logo_url)
                <img style="height: 100px; width: auto" src="{{ $assignment->project->client->logo_url }}"/>
            @else
                {{ $assignment->project->client->business_name }}
            @endif
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <strong>Assignment No:</strong> {{$assignment->id}} <br>
            <strong>Inspector:</strong> {{$timesheet->user->name}} <br>
            <strong>Discipline:</strong> {{$inspector->assignment_type->name}} <br>
            <strong>Vendor / Sub vendor:</strong> {{$assignment->main_vendor_name}} / {{$assignment->sub_vendor_name}} <br>
        </td>
    </tr>
    <tr>
        <td>Date</td>
        <td style="text-align: center">Hours</td>
        <td style="text-align: center">Travel ({{$assignment?->purchase_order?->mileage_unit ?? 'km'}})</td>
        <td style="text-align: center">Expenses ({{$assignment?->purchase_order?->currency}})</td>
    </tr>
    @foreach($timesheet->timesheet_items as $item)
    <tr>
        <td>{{$item->date->format('d-m-Y')}}</td>
        <td style="text-align: center">{{$item->hours}}</td>
        <td style="text-align: center">{{$item->travel_distance}} {{$item->travel_unit}}</td>
        <td style="text-align: center">{{ $timesheet->currency }} @money($item->total_expense)</td>
    </tr>
    @endforeach
    <tr>
        <td style="text-align: right; font-weight: bold">Total</td>
        <td style="text-align: center">{{$timesheet->hours}}</td>
        <td style="text-align: center">{{$timesheet->travel_distance}}</td>
        <td style="text-align: center">{{$timesheet->expenses}}</td>
    </tr>
    <tr style="font-weight: bold">
        <td>Place</td>
        <td>Date</td>
        <td colspan="2">Inspector</td>
    </tr>
    <tr>
        <td>{{ $assignment->vendor?->name }}</td>
        <td>{{$timesheet->signed_off_at?->format('d-m-Y')}}</td>
        <td colspan="2">Print Name: {{$timesheet->user->name}}</td>
    </tr>
    <tr>
        <td colspan="2"></td>
        <td colspan="2" style="vertical-align: center">
            Signed:  <br>
            @if(! empty($timesheet->signatures->inspector_signature))
                <img style="height: 75px; width: auto" src="{{ $timesheet->signatures->inspector_signature }}"/>
            @endif
        </td>
    </tr>

    <tr style="font-weight: bold">
        <td>Place</td>
        <td>Date</td>
        <td colspan="2">Reviewed and Approved By</td>
    </tr>
    <tr>
        <td>{{ $assignment->operation_org->name ?? $assignment->org->name ?? '' }}</td>
        <td>{{$timesheet->approved_at?->format('d-m-Y')}}</td>
        <td colspan="2">Print Name: {{ $assignment->operation_coordinator?->name ?? $assignment->coordinator?->name ?? ''}}</td>
    </tr>
    <tr>
        <td colspan="2"></td>
        <td colspan="2" style="vertical-align: center">
            Signed: <br>
            @if(! empty($timesheet->signatures?->coordinator_signature))
                <img style="height: 75px; width: auto" src="{{ $timesheet->signatures?->coordinator_signature }}"/>
            @endif
        </td>
    </tr>

    <tr style="font-weight: bold">
        <td>Place</td>
        <td>Date</td>
        <td colspan="2">Reviewed and Approved By {{$assignment->project->client->client_group}}</td>
    </tr>
    <tr>
        <td>{{ $assignment->project->client->business_name }}</td>
        <td>{{$timesheet->client_approved_at?->format('d-m-Y')}}</td>
        <td colspan="2">Print Name: {{$assignment->project->client?->user?->name}}</td>
    </tr>
    <tr>
        <td colspan="2"></td>
        <td colspan="2" style="vertical-align: center">
            Signed:  <br>
            @if(! empty($timesheet->signatures?->client_signature))
                <img style="height: 75px; width: auto" src="{{ $timesheet->signatures?->client_signature }}"/>
            @endif
        </td>
    </tr>
</x-pdf.table>
