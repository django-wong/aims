<?php

namespace App\Http\Controllers\APIv1;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use App\Http\Requests\APIv1\Users\StoreRequest;
use App\Http\Requests\APIv1\Users\UpdateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
                        ->whereColumn('user_roles.user_id', 'users.id')
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
            }),

            AllowedFilter::callback('keywords', function (Builder $query, $value) {
                $query->where(function (Builder $query) use ($value) {
                    $query->where('name', 'like', "%$value%")
                        ->orWhere('email', 'like', "%$value%");
                });
            })
        ];
    }

    protected function allowedSorts()
    {
        return ['name'];
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
        if (auth()->id() === (int)$id) {
            return response()->json([
                'error' => 'You cannot change your own role.'
            ], 403);
        }

        $user = User::query()->findOrFail($id);

        $validated = $request->validate([
            'role' => 'required|integer|in:2,3,4,5,8'
        ]);

        $user->user_role->role = $validated['role'];

        return response()->json([
            'data' => $user->user_role->save()
        ]);
    }

    /**
     * @throws \Throwable
     */
    public function store(StoreRequest $request)
    {
        $user = DB::transaction(function () use ($request) {
            $user = User::query()->create($request->userData());
            $user->user_role()->create([
                ...$request->roleData(),
                'org_id' => $request->user()->user_role->org_id
            ]);

            return $user;
        });

        return response()->json([
            'data' => $user->load('user_role'),
            'message' => 'User created successfully'
        ], 201);
    }

    public function update(User $user, UpdateRequest $request)
    {

        $validated = $request->userData();

        $user->update($validated);

        return response()->json([
            'data' => $user->load('user_role'),
            'message' => 'User updated successfully'
        ]);
    }
}
