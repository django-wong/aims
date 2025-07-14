<?php

namespace App\Repositories;

use App\Models\Address;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Support\Facades\DB;

class BusinessRepository {
    /**
     * Create a new business and make the optional user as the owner.
     * @throws \Throwable
     */
    public function create(array $data, ?User $user = null)
    {
        return DB::transaction(function () use ($data, $user) {
            $business = \App\Models\Business::query()->create($data);
            if ($user) {
                $business->users()->attach($user, [
                    'role' => UserRole::TYPE_OWNER
                ]);
            }
            return $business;
        });
    }
}
