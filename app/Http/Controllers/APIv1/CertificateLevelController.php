<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\StoreCertificateLevelRequest;
use App\Http\Requests\UpdateCertificateLevelRequest;
use App\Models\CertificateLevel;

class CertificateLevelController extends Controller
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
    public function store(StoreCertificateLevelRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(CertificateLevel $certificateLevel)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CertificateLevel $certificateLevel)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCertificateLevelRequest $request, CertificateLevel $certificateLevel)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CertificateLevel $certificateLevel)
    {
        //
    }
}
