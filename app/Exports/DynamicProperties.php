<?php

namespace App\Exports;

trait DynamicProperties
{
    public function properties(): array
    {
        return [
            'creator' => auth()->user()?->name ?? config('app.name')
        ];
    }
}
