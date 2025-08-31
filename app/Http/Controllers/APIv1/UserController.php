<?php

namespace App\Http\Controllers\APIv1;

use App\Models\User;
use App\Models\UserRole;
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
            AllowedFilter::callback('preset', function (Builder $query, $value) {
                $roles = match ($value) {
                    'inspectors' => [5],
                    default => [2, 3, 4, 6, 8]
                };

                $query->whereExists(function (QueryBuilder  $query) use ($roles) {
                    $query->selectRaw(1)
                        ->from('user_roles')
                        ->whereColumn('user_roles.user_id', 'users.id')
                        ->whereIn(
                            'user_roles.role', $roles
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
            'user_role', 'inspector_profile', 'address'
        ];
    }

    public function index(Request $request)
    {

        Gate::authorize('viewAny', User::class);
        return response()->json(
            $this->getQueryBuilder()
                ->where(function (Builder $query) use ($request) {
                    $query->ofOrg($request->input('org', $request->user()->org->id));
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

        if ($user->user_role->role === UserRole::CLIENT) {
            return response()->json([
                'error' => 'You cannot change role of a client user.'
            ], 403);
        }

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

    public function destroy(User $user)
    {
        if (auth()->id() === $user->id) {
            return response()->json([
                'error' => 'You cannot delete your own account.'
            ], 403);
        }

        Gate::authorize('delete', $user);

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }
}
