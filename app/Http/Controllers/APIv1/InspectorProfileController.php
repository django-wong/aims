<?php

namespace App\Http\Controllers\APIv1;

use App\Http\Requests\APIv1\Inspectors\StoreRequest;
use App\Http\Requests\APIv1\UpdateInspectorRequest;
use App\Models\CurrentOrg;
use App\Models\InspectorProfile;
use App\Models\User;
use App\Models\UserRole;
use App\Notifications\AccountCreated;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Gate;

/**
 * Inspector Controller is just a specialized User Controller for creating inspectors.
 */
class InspectorProfileController extends Controller
{
    public function index(Request $request, CurrentOrg $org)
    {
        return $this->getQueryBuilder()->tap(function (Builder $query) use ($org) {

            $query->whereIn('user_id', function (QueryBuilder $query) use ($org) {
                $query->select('user_id')->from('user_roles')->where('org_id', $org->id)->whereIn(
                    'role', [
                        UserRole::STAFF,
                        UserRole::INSPECTOR,
                    ]
                );
            });

            $query->leftJoin('users', 'users.id', '=', 'inspector_profiles.user_id');
            $query->leftJoin('addresses', 'addresses.id', '=', 'inspector_profiles.address_id');

            $query->select([
                'inspector_profiles.*',
                'users.name as name',
                'users.email as email',
                'addresses.*'
            ]);

        })->paginate();
    }

    protected function allowedSorts()
    {
        return [
            'name'
        ];
    }

    public function store(StoreRequest $request)
    {
        Gate::authorize('create', InspectorProfile::class);

        /**
         * @var \App\Models\User $user
         */

        if ($request->has('for_user_id')) {

            $user = User::query()->find($request->input('for_user_id'));
            Gate::authorize('create', [InspectorProfile::class, $user]);

        } else {

            $user = User::query()->create($request->validated());
            $user->user_role()->create([
                'org_id' => $request->user()->user_role->org_id,
                'role' => UserRole::INSPECTOR,
            ]);
            $user->notify(
                new AccountCreated($user, $request->input('password'))
            );

        }

        /**
         * @var \App\Models\InspectorProfile $profile
         */
        $profile = $user->inspector_profile()->create($request->validated('inspector_profile') ?? []);

        if (! empty($request->validated('address'))) {
            $address = $user->address()->create($request->validated('address'));
            foreach ([$user, $profile] as $subject) {
                $subject->address()->associate($address)->save();
            }
        } else {
            $profile->address_id = $user->address_id;
            $profile->save();
        }

        return [
            'data' => $user->load('inspector_profile', 'user_role')
        ];
    }

    public function update(UpdateInspectorRequest $request, InspectorProfile $inspector_profile)
    {
        if (! empty($request->validated('inspector_profile'))) {
            $inspector_profile->update($request->validated('inspector_profile'));
        }

        if (! empty($request->validated('address'))) {
            $address = $inspector_profile->address()->updateOrCreate([], $request->validated('address'));
            foreach ([$inspector_profile, $inspector_profile->user] as $subject) {
                $subject->address()->associate($address)->save();
            }
        }

        $inspector_profile->user->update($request->basic());

        return [
            'data' => $inspector_profile->user->load('inspector_profile', 'user_role'),
            'message' => 'Inspector updated successfully.'
        ];
    }

    public function destroy(InspectorProfile $inspectorProfile)
    {
        Gate::authorize('delete', $inspectorProfile);

        $inspectorProfile->delete();

        return [
            'message' => 'Inspector profile deleted successfully.'
        ];
    }
}
