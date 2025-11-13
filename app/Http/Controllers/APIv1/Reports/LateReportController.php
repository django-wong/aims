<?php

namespace App\Http\Controllers\APIv1\Reports;

use App\Http\Controllers\APIv1\Controller;

class LateReportController extends Controller
{
    public function index()
    {
        return $this->getQueryBuilder()->visible()->paginate();
    }
}
