<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\StoreCertificateTypeRequest;
use App\Http\Requests\APIv1\UpdateCertificateTypeRequest;
use App\Models\CertificateType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CertificateTypeController extends Controller
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
    public function store(StoreCertificateTypeRequest $request)
    {
        $certificateType = CertificateType::query()->create($request->validated());

        return [
            'message' => 'Certificate Type created successfully.',
            'data' => $certificateType,
        ];
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCertificateTypeRequest $request, CertificateType $certificateType)
    {
        $certificateType->update($request->validated());

        return [
            'message' => 'Certificate Type updated successfully.',
            'data' => $certificateType,
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, CertificateType $certificateType)
    {
        Gate::authorize('delete', $certificateType);

        $certificateType->delete();

        return [
            'message' => 'Certificate Type deleted successfully.',
        ];
    }
}
