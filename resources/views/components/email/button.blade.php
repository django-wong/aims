@props([
    'url' => null,
])
<a
    href="{{ $url }}"
    style="color:#ffffff;text-decoration-line:none;background-color:#1c4592;border-radius:0.25rem;padding:0.8rem 1rem;font-weight:bold;display:inline-block"
    target="_blank">
    {{ $slot }}
</a>
