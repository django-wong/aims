<?php

namespace App\Http\Controllers\APIv1\Reports;

use App\Http\Controllers\APIv1\Controller;

class ManHoursByYearController extends Controller
{
    public function __invoke()
    {
        return $this->getQueryBuilder()->paginate();
    }
}
