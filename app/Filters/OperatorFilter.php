<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class OperatorFilter implements Filter
{
    public function __invoke(Builder $query, mixed $value, string $property): void
    {
        $operator = '=';
        $operand = '';

        $context = null;
        foreach (mb_str_split($value) as $char) {
            if ($context == null) {
                if ($this->startWithOperator($char)) {
                    $operator = $char;
                    $context = 'operator';
                } else {
                    $operand.= $char;
                    $context = 'value';
                }
            } else {
                if ($context === 'operator') {
                    if ($char === ' ') {
                        $context = 'value';
                        continue;
                    }
                    $operator .= $char;
                } else {
                    $operand = trim($operand . $char);
                }
            }
        }

        if (! empty($value)) {
            $query->where($property, $this->getOperator($operator), $operand);
        }

    }

    protected function startWithOperator($char): bool
    {
        return in_array($char, ['=', '<', '>', '!', '~']);
    }

    protected function getOperator($operator): string
    {
        return match ($operator) {
            '!=' => '!=',
            '<>' => '<>',
            '<' => '<',
            '>' => '>',
            '<=' => '<=',
            '>=' => '>=',
            '~' => 'LIKE',
            '!~' => 'NOT LIKE',
            default => '=',
        };
    }
}
