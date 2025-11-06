<?php

namespace App\Http\Middleware;

use App\Http\Controllers\APIv1\MenuController;
use App\Models\Org;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Gate;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $session = $request->session();
        $user = $request->user();

        return [
            ...parent::share($request),
            'menu' => App::call(MenuController::class),
            'name' => config('app.name'),
            'privileges' => [
               'can_switch_org' => Gate::allows('switch', Org::class)
            ],
            'auth' => [
                'user' => $user?->load('user_role'),
                'org' => $user?->org,
                'impersonating' => $user?->isImpersonated() ?? false,
                'client' => $user?->client
            ],
            'flash' => [
                'message' => $session->get('message'),
                'error' => $session->get('error'),
            ],
        ];
    }
}
