<?php

namespace App\Providers;

use App\Models\DriverPosition;
use App\Models\DriversPage;
use App\Models\Faq;
use App\Support\WebsiteRevalidator;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
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
        // Applications arrive through the website server, so limit per real client IP
        // (forwarded as client_ip) plus an overall ceiling per calling server.
        RateLimiter::for('driver-applications', function (Request $request) {
            return [
                Limit::perMinute(5)->by('driver-app:' . ($request->input('client_ip') ?: $request->ip())),
                Limit::perMinute(60)->by('driver-app-server:' . $request->ip()),
            ];
        });

        // Refresh the website's /drivers pages as soon as hiring content changes
        $positionChanged = function (DriverPosition $position) {
            WebsiteRevalidator::tags([
                'drivers',
                "driver:{$position->slug}",
                $position->getOriginal('slug') ? 'driver:' . $position->getOriginal('slug') : null,
            ]);
        };
        DriverPosition::saved($positionChanged);
        DriverPosition::deleted($positionChanged);

        DriversPage::saved(fn () => WebsiteRevalidator::tags(['drivers']));

        $faqChanged = function (Faq $faq) {
            if ($faq->page === 'drivers' || $faq->getOriginal('page') === 'drivers') {
                WebsiteRevalidator::tags(['drivers']);
            }
        };
        Faq::saved($faqChanged);
        Faq::deleted($faqChanged);
    }
}
