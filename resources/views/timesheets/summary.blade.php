<table class="base-table">
    <tr>
        <td>BIE Reference Number</td>
        <td>
            {{ $timesheet->assignment->reference_number ?? 'N/A' }}
        </td>
    </tr>
    <tr>
        <td>Signed off by</td>
        <td>
            {{ $timesheet->user->name ?? 'N/A' }} on {{ $timesheet->signed_off_at ? $timesheet->signed_off_at->format('Y-m-d') : 'N/A' }}
        </td>
    </tr>
    <tr>
        <td>Date Range</td>
        <td>{{ $timesheet->start->format('Y-m-d') }} to {{ $timesheet->end->format('Y-m-d') }}</td>
    </tr>
    <tr>
        <td>Hours</td>
        <td>{{ $timesheet->hours }}</td>
    </tr>
    <tr>
        <td>Travel Distance</td>
        <td>{{ $timesheet->travel_distance }} miles or km</td>
    </tr>
    <tr>
        <td>Total Cost (including expenses)</td>
        <td>${{ number_format($timesheet->cost, 2) }}</td>
    </tr>
</table>
