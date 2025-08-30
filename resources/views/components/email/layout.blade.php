@props([
    'subject' => null
])
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
    <head>
        <title>{{ $subject }}</title>
        <link rel="preload" as="image" href="{{ url('/logo.png') }}" />
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta name="x-apple-disable-message-reformatting"  content=""/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            {!! Vite::content('resources/css/app.css') !!}
        </style>
    </head>
    <body style='margin: 0;font-size: 16px;background-color:#ffffff;font-family:"Avenir", "Helvetica Neue",sans-serif;padding:2rem;'>
        <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style='margin:0 auto;word-break: break-word;'>
            <tbody>
            <tr style="width:100%">
                <td>
                    <img alt="BIE" height="auto" src="{{ url('/logo.png') }}" style="display:block;outline:none;border:none;text-decoration:none" width="48" />
                    @if(! empty($subject))
                        <h1 style="font-size:2rem;font-weight:bold;margin-top:3rem">
                            {{ $subject }}
                        </h1>
                    @endif
                    {{ $slot }}
                    <p style="font-size:1rem;line-height:2;margin-top:1rem;margin-bottom:1rem">
                        Best,<br />- BIE Group
                    </p>
                    <x-email.divider />
                    <img alt="BIE Group" height="auto" src="{{ url('/logo.png') }}" style="width:2rem;display:block;outline:none;border:none;text-decoration:none;-webkit-filter:grayscale(100%);filter:grayscale(100%);margin:20px 0"/>
                    <p style="font-size:0.8rem;line-height:2;color:#8898aa;margin-left:0.25rem;margin-top:1rem;margin-bottom:1rem">
                        BIE Group, Since 1993
                        <br />
                        Integrity and Independence
                    </p>
                </td>
            </tr>
            </tbody>
        </table>
    </body>
</html>
