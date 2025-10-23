@props([
    'head' => false
])
<td {{$attributes->merge(['style' => 'vertical-align: top; border:1px solid #ddd; '.($head ? 'font-weight: bold; ' : '')])}}>{{$slot}}</td>
