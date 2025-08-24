<?php

class QueryFilter implements \Spatie\QueryBuilder\Filters\Filter
{
    public function __invoke(\Illuminate\Database\Eloquent\Builder $query, mixed $value, string $property)
    {
        // $value is a statement like `id = 123 and status in (1,2,3) and (name like 'john wick' or age > 30) or (delete_at is null and user_id is not null)`
        // You need to parse it and apply it to the query builder
        // Do not use whereRaw for security reasons
        // TODO: Implement a parser for the value
    }
}
