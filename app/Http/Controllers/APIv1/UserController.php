<?php

namespace App\Http\Controllers\APIv1;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;

class UserController extends Controller
{
    protected function allowedFilters()
    {
        return [
            AllowedFilter::callback('preset', function (Builder $query) {
                $query->whereExists(function (QueryBuilder  $query) {
                    $query->selectRaw(1)
                        ->from('user_roles')
                        ->whereColumn('user_roles.id', 'users.id')
                        ->whereIn(
                            'user_roles.role', [
                                1, 2, 3, 4, 5, 6, 7, 8
                            ]
                        );
                });
            })->default('users'),
            AllowedFilter::callback('role', function (Builder $query, $value) {
                $query->whereExists(function (QueryBuilder $query) use ($value) {
                    $query->selectRaw(1)
                        ->from('user_roles')
                        ->whereColumn('user_roles.id', 'users.id')
                        ->where(
                            'user_roles.role', $value
                        );
                });
            })
        ];
    }

    protected function allowedIncludes()
    {
        return [
            'user_role'
        ];
    }

    public function index(Request $request)
    {
        // This method will return a list of users
        return response()->json(
            $this->getQueryBuilder()
                ->where(function (Builder $query) use ($request) {
                    $query->ofOrg($request->user()->org->id);
                })
                ->paginate()
        );
    }
}
