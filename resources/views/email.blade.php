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
    <!--$-->
</head>
<body
    style='background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'>
<table
    align="center"
    width="100%"
    border="0"
    cellpadding="0"
    cellspacing="0"
    role="presentation"
    style='margin:0 auto;padding:48px 48px;background-image:url("{{ url('/mail-bg.png') }}");background-position:top;background-repeat:no-repeat, no-repeat;background-size: cover;'>
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
                <h1 style="font-size:28px;font-weight:bold;margin-top:48px">
                    {{ $subject }}
                </h1>
            @endif
            <x-email.block>
                @if(! empty($greeting))
                    <x-email.section>
                        <x-email.line>
                            {{ $greeting }},
                        </x-email.line>
                    </x-email.section>
                @endif
                @yield('content')
                @if(! empty($introLines))
                    <x-email.section>
                        @foreach($introLines as $line)
                            <x-email.line>
                                {{ $line }}
                            </x-email.line>
                        @endforeach
                    </x-email.section>
                @endif
                @if(! empty($actionUrl))
                    <x-email.section>
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
                    </x-email.section>
                @endif

                @if(! empty($outroLines))
                    <x-email.section>
                        @foreach($outroLines as $line)
                            <x-email.line>
                                {{ $line }}
                            </x-email.line>
                        @endforeach
                    </x-email.section>
                @endif
            </x-email.block>
            <p
                style="font-size:16px;line-height:26px;margin-top:16px;margin-bottom:16px">
                Best,<br />- BIE Group
            </p>
            <hr
                style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#dddddd;margin-top:48px" />
            <img
                height="auto"
                src="{{ url('/logo.png') }}"
                style="display:block;outline:none;border:none;text-decoration:none;-webkit-filter:grayscale(100%);filter:grayscale(100%);margin:20px 0"
                width="32"
            />
            <p
                style="font-size:12px;line-height:24px;color:#8898aa;margin-left:4px;margin-top:16px;margin-bottom:16px">
                BIE Group, Since 1993
            </p>
            <p
                style="font-size:12px;line-height:24px;color:#8898aa;margin-left:4px;margin-bottom:16px">
                Integrity and Independence
            </p>
        </td>
    </tr>
    </tbody>
</table>
<!--/$-->
</body>
</html>
