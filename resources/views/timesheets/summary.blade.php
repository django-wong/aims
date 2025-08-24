<table class="base-table">
    <tr>
        <td>Signed off by</td>
        <td>
            {{ $timesheet->assignment->inspector->name ?? 'N/A' }} on {{ $timesheet->sign_off_at ? $timesheet->sign_off_at->format('Y-m-d') : 'N/A' }}
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
