<?php

namespace App\Http\Controllers\APIv1;

class SkillController extends Controller
{
    protected function allowedSorts()
    {
        return [
            'code', 'report_code', 'sort'
        ];
    }

    protected function allowedIncludes()
    {
        return [

        ];
    }

    public function index()
    {
        return $this->getQueryBuilder()->paginate();
    }
}
