<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;
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
            $query->where($property, $this->getOperator($operator), $this->getOperand($operand));
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

    protected function getOperand($operand): string
    {
        // If operand is started with `:`, then it's a variable to be resolved
        if (str_starts_with($operand, ':')) {
            $name = 'get' . Str::studly(substr($operand, 1)) . 'Operand';
            if (method_exists($this, $name)) {
                return call_user_func([$this, $name]);
            }
            throw new \InvalidArgumentException("Undefined operand variable: $operand");
        }
        return $operand;
    }

    public function getMyOrgOperand(): int
    {
        return auth()->user()->user_role->org_id;
    }
}
