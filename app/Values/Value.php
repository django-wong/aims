<?php

namespace App\Values;

use Illuminate\Database\Eloquent\Builder;
use ReturnTypeWillChange;

abstract class Value implements \JsonSerializable
{
    #[ReturnTypeWillChange]
    public function jsonSerialize()
    {
        $value = $this->value();

        if ($value instanceof Builder) {
            return $value->get();
        } else {
            return $value;
        }
    }

    public function __toString()
    {
        return (string)$this->value();
    }

    abstract public function value();
}
