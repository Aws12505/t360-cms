<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    // Public Next.js website (trucking360solutions.com)
    'website' => [
        'url' => env('WEBSITE_URL', 'https://trucking360solutions.com'),
        // Shared secret the website server sends as X-T360-Key when posting applications
        'key' => env('WEBSITE_API_KEY'),
        // On-demand ISR revalidation endpoint on the website
        'revalidate_url' => env('WEBSITE_REVALIDATE_URL'),
        'revalidate_secret' => env('WEBSITE_REVALIDATE_SECRET'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
