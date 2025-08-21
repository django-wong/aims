<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use InvalidArgumentException;

/**
 * Resolves and creates Model instances from table names.
 * Handles plural/singular forms and case-insensitive matching.
 */
class ModelResolver
{
    public static function for($name)
    {
        if (is_string($name)) {
            $name = Str::singular($name);
        }

        if ($name instanceof Model) {
            return $name;
        }

        if (!is_string($name)) {
            throw new InvalidArgumentException('Model name must be a string or an instance of Model.');
        }

        $class = '\\App\\Models\\' . Str::studly($name);

        if (!class_exists($class)) {
            throw new InvalidArgumentException("Model class '$class' does not exist.");
        }

        return new $class;
    }
}
