<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\StoreCertificateLevelRequest;
use App\Http\Requests\UpdateCertificateLevelRequest;
use App\Models\CertificateLevel;
use Illuminate\Support\Facades\Gate;

class CertificateLevelController extends Controller
{
    protected function allowedSorts()
    {
        return [
            'name'
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
    public function store(StoreCertificateLevelRequest $request)
    {
        $certificateLevel = CertificateLevel::query()->create($request->validated());

        return [
            'message' => 'Certificate Level created successfully.',
            'data' => $certificateLevel,
        ];
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCertificateLevelRequest $request, CertificateLevel $certificateLevel)
    {
        $certificateLevel->update($request->validated());

        return [
            'message' => 'Certificate Level updated successfully.',
            'data' => $certificateLevel,
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CertificateLevel $certificateLevel)
    {
        Gate::authorize('delete', $certificateLevel);

        $certificateLevel->delete();

        return [
            'message' => 'Certificate Level deleted successfully.',
        ];
    }
}
