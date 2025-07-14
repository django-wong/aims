<?php

namespace App\Http\Controllers\APIv1;

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

    protected function getModel(): string
    {
        return 'App\\Models\\'.substr_replace(last(explode('\\', get_class($this))), '', -10);
    }

    protected function getQueryBuilder(): QueryBuilder
    {
        $qb = QueryBuilder::for($this->getModel());

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
