<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Only the website's server (which knows WEBSITE_API_KEY) may call protected API endpoints.
 */
class VerifyWebsiteKey
{
    public function handle(Request $request, Closure $next): Response
    {
        $expected = (string) config('services.website.key');
        $given = (string) $request->header('X-T360-Key');

        if ($expected === '' || !hash_equals($expected, $given)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
