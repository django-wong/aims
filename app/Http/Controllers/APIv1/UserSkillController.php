<?php

namespace App\Http\Controllers\APIv1;

class UserSkillController extends Controller
{
    public function index()
    {
        return $this->getQueryBuilder()->paginate();
    }
}
