<?php

namespace App\Http\Controllers\APIv1\Reports;

use App\Http\Controllers\APIv1\Controller;
use Illuminate\Http\Request;

class ExpiringCertificateController extends Controller
{
    public function __invoke(Request $request)
    {
        return $this->getQueryBuilder()->defaultSort('expires_at')->paginate();
    }
}
