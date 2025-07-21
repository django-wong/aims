<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\Vendors\StoreRequest;
use App\Http\Requests\APIv1\Vendors\UpdateRequest;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;

class VendorController extends Controller
{
    protected function allowedFilters()
    {
        return [
            AllowedFilter::callback('keywords', function ($query, $value) {
                $query->where(function (Builder $query) use ($value) {
                    $query->where('name', 'like', "%{$value}%")->orWhere('business_name', 'like', "%{$value}%");
                });
            }),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->getQueryBuilder()->scoped()->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $vendor = Vendor::query()->create([
            ...$request->validated(),
            'org_id' => $request->user()->org->id,
        ]);

        return response()->json([
            'data' => $vendor->refresh(),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Vendor $vendor)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Vendor $vendor)
    {
        $vendor->update($request->validated());

        return response()->json([
            'data' => $vendor->refresh(),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vendor $vendor)
    {
        //
    }
}
