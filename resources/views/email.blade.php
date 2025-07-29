<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
<head>
    <link
        rel="preload"
        as="image"
        href="{{ url('/logo.png') }}" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!--$-->
</head>
<body
    style='margin: 0;font-size: 16px;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'>
<table
    align="center"
    width="100%"
    border="0"
    cellpadding="0"
    cellspacing="0"
    role="presentation"
    style='margin:0 auto;padding:2rem;background-image:url("{{ url('/mail-bg.png') }}");background-position:top;background-repeat:no-repeat, no-repeat;background-size: cover;'>
    <tbody>
    <tr style="width:100%">
        <td>
            <img
                alt="Raycast"
                height="auto"
                src="{{ url('/logo.png') }}"
                style="display:block;outline:none;border:none;text-decoration:none"
                width="48" />
            @if(! empty($subject))
                <h1 style="font-size:2rem;font-weight:bold;margin-top:3rem">
                    {{ $subject }}
                </h1>
            @endif
            <x-email.block>
                <x-email.section>
                    @if(! empty($greeting))
                    <x-email.line>
                        {{ $greeting }},
                    </x-email.line>
                    @endif
                    @if(! empty($introLines))
                        @foreach($introLines as $line)
                            <x-email.line>
                                {{ $line }}
                            </x-email.line>
                        @endforeach
                    @endif
                    @if(! empty($actionUrl))
                        <x-email.line>
                            <x-email.button :url="$actionUrl">
                                {{ $actionText ?: $actionUrl }}
                            </x-email.button>
                        </x-email.line>
                        <x-email.line>
                            If you’re having trouble clicking the button, copy and paste the URL below
                            into your web browser. <br />
                            <a href="{{$actionUrl}}">{{$actionUrl}}</a>
                        </x-email.line>
                    @endif
                    @yield('content')
                    @if(! empty($outroLines))
                        @foreach($outroLines as $line)
                            <x-email.line>
                                {{ $line }}
                            </x-email.line>
                        @endforeach
                    @endif
                </x-email.section>
            </x-email.block>
            <p
                style="font-size:1rem;line-height:2;margin-top:1rem;margin-bottom:1rem">
                Best,<br />- BIE Group
            </p>
            <x-email.divider />
            <img
                alt="BIE Group"
                height="auto"
                src="{{ url('/logo.png') }}"
                style="width:2rem;display:block;outline:none;border:none;text-decoration:none;-webkit-filter:grayscale(100%);filter:grayscale(100%);margin:20px 0"
            />
            <p
                style="font-size:0.8rem;line-height:2;color:#8898aa;margin-left:0.25rem;margin-top:1rem;margin-bottom:1rem">
                BIE Group, Since 1993
                <br />
                Integrity and Independence
            </p>
        </td>
    </tr>
    </tbody>
</table>
<!--/$-->
</body>
</html>
