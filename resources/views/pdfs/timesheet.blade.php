@php
$inspector = \App\Models\AssignmentInspector::query()->with('assignment_type')->where([
    'assignment_id' => $timesheet->assignment_id,
    'user_id' => $timesheet->user_id,
])->first();

$assignment = \App\Models\AssignmentDetail::query()->find($timesheet->assignment_id);

$detail = \App\Models\HoursEntry::query()->where('timesheet_id', $timesheet->id)->first();

$timesheet_items = \App\Models\TimesheetItem::query()->with('expense')->where('timesheet_id', $timesheet->id)->cursor();
@endphp

<table>
    <tr>
        <td style="width: auto; text-align: center; font-size: 24px; vertical-align: center; font-weight: bold">
            <span style="font-size: 12px">BIE GROUP</span>
            <br>
            Weekly Time & Expense Summary
        </td>
    </tr>
</table>

<p></p>

<table cellpadding="4">
    <tr>
        <td style="border: 1px solid #000">Client: {{ $detail->client_name }}</td>
        <td style="border: 1px solid #000">WO/SO#: {{ $assignment->purchase_order->title }}</td>
        <td style="border: 1px solid #000">ESN: </td>
        <td style="border: 1px solid #000">Name: {{ $detail->inspector_name }}</td>
    </tr>
    <tr>
        <td style="border: 1px solid #000">Wk Number: {{ $timesheet->week }}</td>
        <td style="border: 1px solid #000">BIE REF: {{ $assignment->reference_number }}  </td>
        <td style="border: 1px solid #000">REPORT No.: {{ $detail->report_number }}</td>
        <td style="border: 1px solid #000">Location: {{ $detail->main_vendor_address }}</td>
    </tr>
</table>

<p></p>

<table cellpadding="4">
    <tr>
        <td rowspan="2" style="border: 1px solid #000">Date</td>
        <td style="border: 1px solid #000" colspan="4">Hour Claimed</td>
        <td style="border: 1px solid #000" colspan="3">Travel</td>
        <td rowspan="2" style="border: 1px solid #000">Overnight<br>Days</td>
        <td style="border: 1px solid #000" colspan="5">Expenses</td>
        <td rowspan="2" style="border: 1px solid #000">Total</td>
    </tr>
    <tr>
        <td style="border: 1px solid #000">I/T/R</td>
        <td style="border: 1px solid #000">Total</td>
        <td style="border: 1px solid #000">Rate</td>
        <td style="border: 1px solid #000">Cost</td>
        <td style="border: 1px solid #000">D</td>
        <td style="border: 1px solid #000">Rate</td>
        <td style="border: 1px solid #000">Cost</td>
        <td style="border: 1px solid #000">Sub</td>
        <td style="border: 1px solid #000">H</td>
        <td style="border: 1px solid #000">M</td>
        <td style="border: 1px solid #000">T</td>
        <td style="border: 1px solid #000">O</td>
    </tr>
    @foreach($timesheet_items as $item)
        @php
        $expense_by_type = $item->expense?->expenses_by_type ?? [];
        @endphp
        <tr>
            <td style="border: 1px solid #000">{{ $item->date->format('d/m/Y') }}</td>
            <td style="border: 1px solid #000">{{ $item->work_hours }} / {{ $item->travel_hours}} / {{ $item->report_hours }}</td>
            <td style="border: 1px solid #000">{{ $item->hours }}</td>
            <td style="border: 1px solid #000">@money($item->hourly_rate)</td>
            <td style="border: 1px solid #000">@money($item->cost)</td>
            <td style="border: 1px solid #000">{{ $item->travel_distance }}</td>
            <td style="border: 1px solid #000">{{ $item->travel_rate }}</td>
            <td style="border: 1px solid #000">@money($item->travel_cost)</td>
            <td style="border: 1px solid #000">{{ $item->overnights }}</td>
            <td style="border: 1px solid #000">@money($item->total_expense)</td>
            <td style="border: 1px solid #000">@money(isset($expense_by_type['accommodation']) ? $expense_by_type['accommodation'] : 0)</td>
            <td style="border: 1px solid #000">@money(isset($expense_by_type['meals']) ? $expense_by_type['meals'] : 0)</td>
            <td style="border: 1px solid #000">@money(isset($expense_by_type['travel']) ? $expense_by_type['travel'] : 0)</td>
            <td style="border: 1px solid #000">@money(isset($expense_by_type['other']) ? $expense_by_type['other'] : 0)</td>
            <td style="border: 1px solid #000">@money($item->total_cost)</td>
        </tr>
    @endforeach
    <tr style="font-weight: bold;">
        <td colspan="2" style="border:1px solid #000;">Weekly Total</td>
        <td style="border:1px solid #000;">{{ $timesheet->hours }}</td>
        <td colspan="2" style="border:1px solid #000;"></td>
        <td style="border:1px solid #000;">{{ $timesheet->travel_distance }}</td>
        <td style="border:1px solid #000;" colspan="8"></td>
        <td style="border:1px solid #000;">{{ $timesheet->expenses }}</td>
    </tr>
</table>

<table cellpadding="4">
    <tr>
        <td style="border: 1px solid #000">
            <table>
                <tr><td>Place: {{ $assignment->vendor?->name }}</td></tr>
                <tr><td>Date: {{$timesheet->signed_off_at?->format('d-m-Y')}}</td></tr>
                <tr><td>Print Name:{{$timesheet->user->name}}</td></tr>
                <tr>
                    <td>Signed:<br>
                        @if(! empty($timesheet->signatures->inspector_signature))
                            <img style="height: 40px; width: auto" src="{{ $timesheet->signatures->inspector_signature }}"/>
                       @endif
                    </td>
                </tr>
            </table>
        </td>
        <td style="border: 1px solid #000">
            <table>
                <tr><td>Place: {{ $assignment->operation_org->name ?? $assignment->org->name ?? '' }}</td></tr>
                <tr><td>Date: {{$timesheet->approved_at?->format('d-m-Y')}}</td></tr>
                <tr><td>Print Name: {{ $assignment->operation_coordinator?->name ?? $assignment->coordinator?->name ?? ''}}</td></tr>
                <tr>
                    <td>Signed:<br>
                        @if(! empty($timesheet->signatures?->coordinator_signature))
                            <img style="height: 40px; width: auto" src="{{ $timesheet->signatures?->coordinator_signature }}"/>
                       @endif
                    </td>
                </tr>
            </table>
        </td>
        <td style="border: 1px solid #000">
            <table>
                <tr><td>Reviewed and Approved By: {{ $assignment->project->client->client_group }} {{ $assignment->project->client->business_name }}</td></tr>
                <tr><td>Date: {{ $timesheet->client_approved_at?->format('d-m-Y') }}</td></tr>
                <tr><td>Print Name: {{ $assignment->project->client?->user?->name }}</td></tr>
                <tr>
                    <td>Signed:<br>
                        @if(! empty($timesheet->signatures->client_signature))
                            <img style="height: 40px; width: auto" src="{{ $timesheet->signatures->client_signature }}"/>
                       @endif
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
