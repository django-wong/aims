@props([
    'url' => null,
])
<a
    href="{{ $url }}"
    style="color:#ffffff;text-decoration-line:none;background-color:#1c4592;border-radius:4px;padding:10px 16px;font-weight:bold;display:inline-block"
    target="_blank">
    {{ $slot }}
</a>
