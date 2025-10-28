<?php

namespace App\Http\Controllers\APIv1;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;
use Spatie\QueryBuilder\QueryBuilder;

abstract class Controller
{
    protected function allowedFilters()
    {
        return [
            // Override this method
        ];
    }

    protected function allowedIncludes()
    {
        return [
            // Override this method
        ];
    }

    protected function allowedSorts()
    {
        return [

        ];
    }

    protected function allowedFields(): array|string
    {
        return '*';
    }

    protected function getQueryBuilderFrom(): string|Builder|Relation
    {
        return $this->getModel();
    }

    protected function getModel(): string
    {
        return 'App\\Models\\' . substr_replace(last(explode('\\', get_class($this))), '', -10);
    }

    protected function getQueryBuilder(string|Builder|Relation|null $from = null): QueryBuilder
    {
        $qb = QueryBuilder::for($from ?? $this->getQueryBuilderFrom());

        $allowedFields = $this->allowedFields();
        if (!empty($allowedFields)) {
            $qb->allowedFields(
                $allowedFields
            );
        }

        $qb->allowedIncludes(
            $this->allowedIncludes()
        );

        $qb->allowedFilters(
            $this->allowedFilters()
        );

        return $qb->allowedSorts($this->allowedSorts());
    }
}
