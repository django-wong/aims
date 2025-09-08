<x-email.layout :subject="$subject">
    <x-email.block>
        <x-email.section>
            @if(! empty($greeting))
            <x-email.line> {{ $greeting }}, </x-email.line>
            @endif
            @if(! empty($introLines))
                @foreach($introLines as $line)
                    <x-email.line> {{ $line }} </x-email.line>
                @endforeach
            @endif
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
                @foreach($outroLines as $line)
                    <x-email.line> {{ $line }} </x-email.line>
                @endforeach
            @endif
        </x-email.section>
    </x-email.block>
</x-email.layout>
