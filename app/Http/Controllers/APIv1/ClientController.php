<?php

namespace App\Http\Controllers\APIv1;

use App\Models\Client;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Http\Request;
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
        return response()->json(
            $this->getQueryBuilder()
                ->where(function (Builder $query) use ($request) {
                    $query->where('org_id', $request->user()->org->id);
                })
                ->paginate()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
    public function update(Request $request, Client $client)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        //
    }
}
