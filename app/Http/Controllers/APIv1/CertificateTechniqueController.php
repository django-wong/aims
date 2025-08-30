<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\StoreCertificateTechniqueRequest;
use App\Http\Requests\UpdateCertificateTechniqueRequest;
use App\Models\CertificateTechnique;

class CertificateTechniqueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->getQueryBuilder()->paginate();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCertificateTechniqueRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(CertificateTechnique $certificateTechnique)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CertificateTechnique $certificateTechnique)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCertificateTechniqueRequest $request, CertificateTechnique $certificateTechnique)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CertificateTechnique $certificateTechnique)
    {
        //
    }
}
