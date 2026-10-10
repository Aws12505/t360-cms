<?php

namespace App\Support;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Asks the Next.js website to refresh cached pages after CMS edits.
 * Fire-and-forget: if it fails the website's 5-minute ISR window still applies.
 */
class WebsiteRevalidator
{
    public static function tags(array $tags): void
    {
        $url = config('services.website.revalidate_url');
        $secret = config('services.website.revalidate_secret');

        if (!$url || !$secret || app()->runningUnitTests()) {
            return;
        }

        $tags = array_values(array_unique(array_filter($tags)));

        app()->terminating(function () use ($url, $secret, $tags) {
            try {
                Http::timeout(3)
                    ->withHeaders(['X-Revalidate-Secret' => $secret])
                    ->post($url, ['tags' => $tags]);
            } catch (\Throwable $e) {
                Log::warning('Website revalidation failed: ' . $e->getMessage());
            }
        });
    }
}
