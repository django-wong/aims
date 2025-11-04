<?php

namespace App\Providers;

use App\Models\CurrentOrg;
use App\Models\Org;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Auth\Access\Gate;
use Illuminate\Auth\Middleware\RedirectIfAuthenticated;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\ServiceProvider;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\QueryBuilderRequest;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Auth::macro('isClient', function () {
            return auth()->user()?->user_role->isAnyOf([UserRole::CLIENT]);
        });

        Auth::macro('role', function () {
            return auth()->user()?->user_role;
        });

        // System admin can do everything
        \Illuminate\Support\Facades\Gate::before(function (User $user, $ability) {
            if ($user->isAnyRole([UserRole::SYSTEM]) || $user->id === 1) {
                return true;
            }
            return null;
        });

        // Only limited roles can view the dashboard, and the content is varied based on role
        \Illuminate\Support\Facades\Gate::define('viewDashboard', function (User $user) {
            return $user->isAnyRole([
                UserRole::SYSTEM,
                UserRole::ADMIN,
                UserRole::PM,
                UserRole::STAFF,
                UserRole::CLIENT
            ]);
        });

        // Override the default delimiter for array filters from ',' to '|'
        QueryBuilderRequest::setFilterArrayValueDelimiter('|');

        // [Not Used] Redirect user to the set-up page if they don't have an org yet
        RedirectIfAuthenticated::redirectUsing(function ($request) {
            if (! $request->user()->org()->exists()) {
                return route('setup');
            }
            return route('dashboard');
        });

        // API rate limiting per user or IP for unauthenticated users
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(1000)
                ->by($request->user()?->id ?: $request->ip());
        });

        // Render a base64 encoded OR code, usage: <img src="@qr('data')"/>
        Blade::directive('qr', function ($expression) {
            return "<?php echo (new \chillerlan\QRCode\QRCode())->render($expression); ?>";
        });

        // Scoped binding for the current organization
        $this->app->scoped(CurrentOrg::class, function () {
            $org_id = auth()->user()?->user_role?->org_id;
            if ($org_id) {
                return Org::query()->find($org_id);
            }
            return new Org();
        });

        // Format a number as money with 2 decimal places, usage: @money($amount)
        Blade::directive('money', function ($expression) {
            return "<?php echo number_format($expression, 2); ?>";
        });
    }
}
