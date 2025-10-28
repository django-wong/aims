<?php

namespace App\Exports;

use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Spatie\QueryBuilder\QueryBuilder;

abstract class FromQueryBuilder implements FromQuery
{

    public static function fromQueryBuilder(QueryBuilder $query): static
    {
        return new static(
            $query->getEloquentBuilder()
        );
    }

    public function query()
    {
        return $this->query;
    }

    public function __construct(private readonly Builder $query)
    {
    }
}
