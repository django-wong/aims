@php
$timezone = $noi->org->timezone ?? config('app.timezone');
@endphp
<x-email.layout :subject="$subject">
    <x-email.block>
        <x-email.section>
            <x-email.line>Hello {{ trim($notifiable->name) }},</x-email.line>
            <x-email.line>
                The client {{ $noi->assignment->project->client->business_name }} has requested an inspection for assignment <i>{{ $noi->assignment->reference_number }}</i>.
            </x-email.line>

            <x-email.article>
                <strong>Location:</strong><br />
                <i>{{ $noi->location ?? 'N/A' }}</i>
            </x-email.article>

            <x-email.article>
                <strong>Description:</strong><br />
                <i>{{ $noi->description ?? 'N/A' }}</i>
            </x-email.article>

            <x-email.article>
                <strong>Preferred Date:</strong><br />
                <i>{{ $noi->from->timezone($timezone)->format('F j, Y H:i') }} to {{ $noi->to->timezone($timezone)->format('F j, Y H:i', $timezone) }} ({{ $timezone }})</i>
            </x-email.article>

            @if(! empty($actionUrl))
                <x-email.line>
                    <x-email.button :url="$actionUrl"> {{ $actionText ?: $actionUrl }} </x-email.button>
                </x-email.line>
                <x-email.line>
                    If you’re having trouble clicking the button, copy and paste the URL below
                    into your web browser. <br />
                    <a target="_blank" href="{{$actionUrl}}">{{$actionUrl}}</a>
                </x-email.line>
            @endif
            @yield('content')
            @if(! empty($outroLines))
                @foreach($outroLines as $line)<x-email.line> {{ $line }} </x-email.line>@endforeach
            @endif
        </x-email.section>
    </x-email.block>
</x-email.layout>
