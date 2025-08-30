<?php

namespace App\Http\Controllers\APIv1;

use App\Models\CertificateType;
use Illuminate\Http\Request;

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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(CertificateType $certificateType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CertificateType $certificateType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CertificateType $certificateType)
    {
        //
    }
}
