@php
$max = count($skills) + 2;
@endphp

<x-pdf.layout>
    <x-pdf.header>
        <table style="width: 100%; margin: 0; padding: 0; border: none; border-collapse: collapse;">
            <tr>
                <td style="height: 100%; vertical-align: bottom; font-size: 32px; font-weight: bold" class="left">Skill Matrix</td>
                <td style="height: 100%; vertical-align: bottom; position: relative" class="right">
                    <img style="position: absolute; right: -4px; bottom: 8px; height: 48px; width: auto" src="{{ public_path('logo.png') }}"/>
                </td>
            </tr>
        </table>
    </x-pdf.header>
    <x-pdf.footer/>
    <table class="table" style="margin-bottom: 16px;">
        <tr class="head">
            <td>Name</td>
            <td>Location</td>
            @foreach($skills as $skill)
                <td style="text-align: center;">
                    @if($max > 10)
                        @foreach(str_split($skill->code) as $index => $char)
                            {{ $char }} <br>
                        @endforeach
                    @else
                        {{ $skill->code }}
                    @endif
                </td>
            @endforeach
        </tr>
        @forelse($records as $record)
            <tr>
                <td style="white-space: nowrap">{{$record->inspector_name}}</td>
                <td style="white-space: nowrap">{{$record->state}}</td>
                @foreach($skills as $skill)
                    <td style="text-align: center;">
                        @if(in_array($skill->code, $record->skills)) x @endif
                    </td>
                @endforeach
            </tr>
        @empty
            <tr>
                <td colspan="{{ $max }}" style="text-align: center;">No records found</td>
            </tr>
        @endforelse
    </table>
{{--    <x-pdf.page-break/>--}}

    <table>
        <tr>
            <td colspan="3">
                <strong>Classifications</strong>
            </td>
        </tr>
        @foreach($skills->chunk(3) as $chunk)
        <tr>
            @foreach($chunk as $skill)
                <td style="white-space: nowrap; padding-right: 16px"><strong>{{$skill->code}}</strong>: {{$skill->description}}</td>
            @endforeach
        </tr>
        @endforeach
    </table>
</x-pdf.layout>
