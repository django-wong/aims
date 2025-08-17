<?php

namespace App\Models;

trait HasManyBudgets
{
    public function budgets()
    {
        return $this->hasMany(Budget::class);
    }
}
