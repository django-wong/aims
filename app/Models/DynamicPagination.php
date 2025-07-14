<?php

namespace App\Models;

trait DynamicPagination
{
    public function getPerPage()
    {
        return request()->query('per_page', 20);
    }
}
