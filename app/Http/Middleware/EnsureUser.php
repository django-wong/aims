<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use function PHPUnit\Framework\isNumeric;

class EnsureUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $absolute = 'true'): Response
    {
        if ($request->hasValidSignature($absolute === 'true')) {
            if ($user = $request->get('user')) {
                $user = \App\Models\User::query()->find($user);
                if ($user) {
                    auth()->login($user, true);
                }
            }
        }

        return $next($request);
    }
}
