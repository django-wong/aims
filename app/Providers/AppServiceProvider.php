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
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\ServiceProvider;

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
        \Illuminate\Support\Facades\Gate::define('viewDashboard', function (User $user) {
            return $user->isAnyRole([
                UserRole::SYSTEM,
                UserRole::ADMIN,
                UserRole::PM,
                UserRole::STAFF,
                UserRole::CLIENT,
                UserRole::INSPECTOR
            ]);
        });

        RedirectIfAuthenticated::redirectUsing(function ($request) {
            if (! $request->user()->org()->exists()) {
                return route('setup');
            }
            return route('dashboard');
        });

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(1000)
                ->by($request->user()?->id ?: $request->ip());
        });

        Blade::directive('qr', function ($expression) {
            return "<?php echo (new \chillerlan\QRCode\QRCode())->render($expression); ?>";
        });

        $this->app->scoped(CurrentOrg::class, function () {
            $org_id = auth()->user()?->user_role?->org_id;
            if ($org_id) {
                return Org::query()->find($org_id);
            }
            return new Org();
        });

        Blade::directive('money', function ($expression) {
            return "<?php echo number_format($expression, 2); ?>";
        });
    }
}
