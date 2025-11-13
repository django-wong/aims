<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\UpdateOrgRequest;
use App\Models\Address;
use App\Models\CurrentOrg;
use App\Models\Org;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Gate;
use Spatie\QueryBuilder\AllowedFilter;

class OrgController extends Controller
{
    protected function allowedFilters()
    {
        return [
            AllowedFilter::custom(
                'id', new \App\Filters\OperatorFilter()
            )
        ];
    }

    protected function allowedSorts()
    {
        return ['name'];
    }

    protected function allowedIncludes()
    {
        return [
            'address'
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->getQueryBuilder()->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateOrgRequest $request)
    {
        $org = Org::query()->create(Arr::only($request->validated(), ['name', 'code', 'timezone']));

        if (! empty($request->validated('address'))) {
            $org->address()->associate(
                Address::query()->create($request->validated('address'))
            );
            $org->save();
        }

        if (! empty($request->validated('admin'))) {
            $admin = User::query()->create(
                $request->validated('admin')
            );

            $admin->user_role()->create([
                'role' => UserRole::ADMIN,
                'org_id' => $org->id,
            ]);
        }

        return [
            'message' => 'Org created successfully',
        ];
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrgRequest $request, Org $org)
    {
        $org->update($request->validated());

        if (! empty($request->validated('address'))) {
            if ($org->address) {
                $org->address->update($request->validated('address'));
            } else {
                $org->address()->associate(
                    Address::query()->create($request->validated('address'))
                );
                $org->save();
            }
        }

        return [
            'message' => 'Org updated successfully',
            'data' => $org
        ];
    }

    public function destroy(Org $org)
    {
        Gate::denyIf(auth()->user()->user_role->org_id === $org->id, 'You cannot delete the org you are currently logged into.');

        Gate::authorize('delete', $org);

        $org->delete();

        return [
            'message' => 'Org deleted successfully',
        ];
    }
}
