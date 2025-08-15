<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;

function useModel(string $modelNameOrClass): string
{
    if (str_contains($modelNameOrClass, '\\')) {
        $parts = explode('\\', $modelNameOrClass);
        $modelNameOrClass = end($parts);
    }
    $modelName = str_replace(' ', '', ucwords(str_replace('_', ' ', $modelNameOrClass)));
    $modelClass = "App\\Models\\{$modelName}";

    if (class_exists($modelClass)) {
        return $modelClass;
    }

    throw new \InvalidArgumentException("Model class '{$modelClass}' does not exist.");
}
