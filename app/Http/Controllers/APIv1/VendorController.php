<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\Vendors\StoreRequest;
use App\Http\Requests\APIv1\Vendors\UpdateRequest;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
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

    protected function allowedSorts()
    {
        return ['name', 'business_name'];
    }

    protected function allowedIncludes()
    {
        return ['address'];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', Vendor::class);

        return $this->getQueryBuilder()->visible()->paginate();
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

        if (! empty($request->validated('address'))) {
            $address = $vendor->address()->create($request->input('address'));
            $vendor->address_id = $address->id;
            $vendor->save();
        }

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
        Gate::authorize('delete', $vendor);

        $vendor->delete();

        return response()->json([
            'message' => __('Vendor deleted successfully.'),
        ]);
    }
}
