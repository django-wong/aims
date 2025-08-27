<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\Inspectors\StoreRequest;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class InspectorController extends Controller
{
    public function store(StoreRequest $request)
    {
        $user = User::query()->create($request->validated());

        $user->user_role()->create([
            'role' => UserRole::INSPECTOR,
            'org_id' => $request->user()->user_role->org_id,
        ]);

        /**
         * @var \App\Models\InspectorProfile $profile
         */
        $profile = $user->inspector_profile()->create($request->validated('inspector_profile') ?? []);

        if (! empty($request->validated('address'))) {
            $address = $user->address()->create($request->validated('address'));
            $user->address()->associate($address)->save();
            $profile->address()->associate($address)->save();
        }

        return [
            'data' => $user->load('inspector_profile', 'user_role')
        ];
    }
}
