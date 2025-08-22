@props([
    'title' => '',
])
<div>
    <div style="background-color: #eee; padding: 10px; border-top: 1px solid #ddd">
        {{ $title }}
    </div>
    {{ $slot }}
</div>
