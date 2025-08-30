<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\StoreCertificateRequest;
use App\Http\Requests\APIv1\UpdateCertificateRequest;
use App\Models\Certificate;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Gate;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;

class CertificateController extends Controller
{
    protected function allowedFilters()
    {
        return [
            AllowedFilter::exact('certificate_type_id'),
            AllowedFilter::exact('certificate_technique_id'),
            AllowedFilter::exact('certificate_level_id'),
            AllowedFilter::exact('user_id'),

            AllowedFilter::callback('keywords', function (Builder $query, $value) {
                $query->where(function (Builder $query) use ($value) {
                    $query->where('title', 'like', '%' . $value . '%')
                        ->orWhereHas('certificate_type', fn (Builder $query) => $query->where('name', 'like', '%' . $value . '%'))
                        ->orWhereHas('certificate_technique', fn (Builder $query) => $query->where('name', 'like', '%' . $value . '%'))
                        ->orWhereHas('certificate_level', fn (Builder $query) => $query->where('name', 'like', '%' . $value . '%'));
                });
            })
        ];
    }

    protected function allowedSorts()
    {
        return [
            'title',
            'issued_at',
            'expires_at',
            'created_at',
        ];
    }

    protected function allowedIncludes()
    {
        return [
            'user',
            'certificate_type',
            'certificate_technique',
            'certificate_level'
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
    public function store(StoreCertificateRequest $request)
    {
        $certificate = Certificate::query()->create($request->validated());

        return [
            'message' => 'Certificate created successfully',
            'data' => $certificate->load([
                'certificate_type',
                'certificate_technique',
                'certificate_level'
            ])
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(Certificate $certificate)
    {
        Gate::authorize('view', $certificate);

        return response()->json([
            'data' => $certificate->load(['user', 'certificate_type', 'certificate_technique', 'certificate_level'])
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCertificateRequest $request, Certificate $certificate)
    {

        $certificate->update($request->validated());

        return [
            'message' => 'Certificate updated successfully',
            'data' => $certificate->fresh([
                'certificate_type',
                'certificate_technique',
                'certificate_level'
            ])
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Certificate $certificate)
    {
        Gate::authorize('delete', $certificate);

        $certificate->delete();

        return response()->json([
            'message' => 'Certificate deleted successfully'
        ]);
    }
}
