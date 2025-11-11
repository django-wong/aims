<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\UpdateOrgRequest;
use App\Models\Org;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
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
                \App\Models\Address::query()->create($request->validated('address'))
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

        return [
            'message' => 'Org updated successfully',
            'data' => $org
        ];
    }
}
