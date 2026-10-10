<?php

namespace App\Support;

use Illuminate\Support\Str;

class MediaUrl
{
    /**
     * Make a full URL to a file stored under /storage using APP_URL.
     */
    public static function make(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        $clean = ltrim($path, '/');

        if (Str::startsWith($clean, ['http://', 'https://'])) {
            return $path;
        }

        if (Str::startsWith($clean, 'storage/')) {
            return asset($clean);
        }

        return asset('storage/' . $clean);
    }

    /**
     * Rewrite root-relative /storage/... image sources inside editor HTML to absolute
     * URLs so the website (a different host) can load them.
     */
    public static function absolutizeHtml(?string $html): ?string
    {
        if (!$html) {
            return $html;
        }

        $base = rtrim(asset(''), '/');

        return preg_replace('/(src|href)=(["\'])\/storage\//i', '$1=$2' . $base . '/storage/', $html);
    }
}
