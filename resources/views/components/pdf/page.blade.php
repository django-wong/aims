@props([
    'last' => false,
])
<div style="page-break-after: {{ $last ? 'auto' : 'always' }}; width: 100%">
    {{ $slot }}
</div>
