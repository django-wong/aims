<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\Clients\StoreRequest;
use App\Http\Requests\APIv1\Clients\UpdateRequest;
use App\Models\Address;
use App\Models\Client;
use App\Models\Org;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Spatie\QueryBuilder\AllowedFilter;

class ClientController extends Controller
{
    protected function allowedIncludes()
    {
        return [
            'user', 'address', 'org', 'coordinator', 'reviewer'
        ];
    }

    protected function allowedFields(): array|string
    {
        return [
            'org_id', 'id'
        ];
    }

    protected function allowedSorts()
    {
        return [
            'business_name'
        ];
    }

    protected function allowedFilters()
    {
        return [
            AllowedFilter::partial('business_name'),
            AllowedFilter::callback('keywords', function (Builder $query, $value) {
                if (!empty($value)) {
                    $query->whereExists(function (QueryBuilder $query) use ($value) {
                        $query->selectRaw(1)
                            ->from('clients', 'base')
                            ->leftJoin('users', 'users.id', '=', 'base.user_id')
                            ->whereColumn('base.id', 'clients.id')
                            ->where(function (QueryBuilder $query) use ($value) {
                                $query->where('base.business_name', 'like', "%$value%")->orWhere('users.name', 'like', "%$value%")->orWhere('users.email', 'like', "%$value%");
                            });
                    });
                }
            })
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Client::class);

        return response()->json(
            $this->getQueryBuilder()
                ->where(function (Builder $query) use ($request) {
                    // User can see the clients of their own organization, or if they are delegated to the client's work.
                    $query->where('org_id', $request->user()->org->id);
                    // ->orWhere(function (Builder $query) {
                    //     $query->whereIn('id', function (QueryBuilder $query) {
                    //         $query->select('client_id')
                    //             ->from('projects')
                    //             ->whereIn('id', function (QueryBuilder $query) {
                    //                 $query->select('project_id')
                    //                     ->from('assignments')
                    //                     ->where('operation_org_id', Org::current()->id);
                    //             });
                    //     });
                    // });

                    // if (auth()->user()->isRole(UserRole::INSPECTOR)) {
                    //     $query->whereIn('id', function (QueryBuilder $query) {
                    //         $query->select('client_id')
                    //             ->from('projects')
                    //             ->whereIn('id', function (QueryBuilder $query) {
                    //                 $query->select('project_id')
                    //                     ->from('assignments')
                    //                     ->leftJoin('assignment_inspectors', 'assignments.id', '=', 'assignment_inspectors.assignment_id')
                    //                     ->where('assignment_inspectors.user_id', auth()->user()->id);
                    //             });
                    //     });
                    // }
                })
                ->paginate()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $data = DB::transaction(function () use ($request) {
            if (! empty($request->input('address'))) {
                $address = Address::query()->create($request->validated('address'));
            }

            $user = User::query()->create([
                ...$request->validated('user'),
                'password' => ''
            ]);

            $org = $request->user()->org->id;

            $client = Client::query()->create([
                ...$request->basic(),
                'user_id' => $user->id,
                'org_id' => $org,
                'address_id' => $address->id ?? null,
            ]);

            $user->user_role()->create([
                'org_id' => $org,
                'role' => UserRole::CLIENT,
            ]);


            return $client->load(['user', 'address', 'org']);
        });

        return response()->json(['data' => $data]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Client $client)
    {
        $client = DB::transaction(function () use ($request, $client) {
            if ($request->has('user')) {
                $client->user->update($request->validated('user'));
            }

            $client->update($request->basic());

            if (! empty($request->input('address'))) {
                $address = $client->address()->updateOrCreate(
                    [], $request->validated(
                        'address'
                    )
                );
                $client->address_id = $address->id;
                $client->save();
            }

            return $client;
        });


        return response()->json([
            'data' => $client->load(['user', 'address', 'org'])
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        Gate::authorize('delete', $client);

        $client->delete();

        return [
            'message' => 'Client deleted successfully'
        ];
    }
}
