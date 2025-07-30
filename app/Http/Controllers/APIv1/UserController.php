<?php

namespace App\Http\Controllers\APIv1;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
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
                        ->whereColumn('user_roles.user_id', 'users.id')
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

        Gate::authorize('viewAny', User::class);
        return response()->json(
            $this->getQueryBuilder()
                ->where(function (Builder $query) use ($request) {
                    $query->ofOrg($request->user()->org->id);
                })
                ->paginate()
        );
    }

    public function updateRole(Request $request, $id)
    {
        $user = User::query()->findOrFail($id);

        // TOOD: Check if the authenticated user has permission to update roles

        $validated = $request->validate([
            'role' => 'required|integer|in:2,3,4,5,8'
        ]);

        $user->user_role->role = $validated['role'];

        return response()->json([
            'data' => $user->user_role->save()
        ]);
    }
}
