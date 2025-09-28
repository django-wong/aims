<footer style="line-height: 20px; position: fixed; bottom: -80px; height: 80px; left: 0; right: 0; border-top: 1px solid #eee;">
    @if($slot->isEmpty())
        <table style="padding:0; margin: 0; border-collapse: collapse; width: 100%;">
            <tr>
                <td class="left">Generated at {{ date('d/m/Y H:i:s') }}</td>
                <td class="right">
                    {{"BIE Group - ".date('Y')}}
                </td>
            </tr>
        </table>

    @else {{$slot}} @endif
</footer>
