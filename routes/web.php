<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\HeaderSettingController;
use App\Http\Controllers\Admin\FooterSettingController;
use App\Http\Controllers\Admin\HeroSectionController;
use App\Http\Controllers\Admin\VideoSectionController;
use App\Http\Controllers\Admin\SliderController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\MeetingSectionController;
use App\Http\Controllers\Admin\FormSectionController;
use App\Http\Controllers\Admin\PricingPlanController;
use App\Http\Controllers\Admin\CustomPlanFeatureController;
use App\Http\Controllers\Admin\PricingTableController;
use App\Http\Controllers\Admin\PricingBookingController;
use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\ArticleImageController;
use App\Http\Controllers\Admin\MissionController;
use App\Http\Controllers\Admin\PresidentShowcaseController;
use App\Http\Controllers\Admin\Dashboard360Controller;
use App\Http\Controllers\Admin\WhyChooseUsController;
use App\Http\Controllers\Admin\WhyChooseUsFeatureController;
use App\Http\Controllers\Admin\BeyondHiringController;
use App\Http\Controllers\Admin\DriverPositionController;
use App\Http\Controllers\Admin\DriverApplicationController;
use App\Http\Controllers\Admin\DriversPageController;
use App\Http\Controllers\Admin\HiringSettingController;
use App\Http\Controllers\Admin\EditorUploadController;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect('/admin/header');
    }
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('header', [HeaderSettingController::class, 'edit'])->name('header.edit');
        Route::put('header', [HeaderSettingController::class, 'update'])->name('header.update');
        Route::get('footer', [FooterSettingController::class, 'edit'])->name('footer.edit');
        Route::put('footer', [FooterSettingController::class, 'update'])->name('footer.update');
        Route::get('hero', [HeroSectionController::class, 'edit'])->name('hero.edit');
        Route::put('hero', [HeroSectionController::class, 'update'])->name('hero.update');
        Route::get('video', [VideoSectionController::class, 'edit'])->name('video.edit');
        Route::put('video', [VideoSectionController::class, 'update'])->name('video.update');
        Route::resource('sliders', SliderController::class);
        Route::resource('faqs', FaqController::class);
        Route::get('meeting', [MeetingSectionController::class, 'edit'])->name('meeting.edit');
        Route::put('meeting', [MeetingSectionController::class, 'update'])->name('meeting.update');
        Route::get('form-section', [FormSectionController::class, 'edit'])->name('form-section.edit');
        Route::put('form-section', [FormSectionController::class, 'update'])->name('form-section.update');
        Route::resource('pricing-plans', PricingPlanController::class);
        Route::resource('custom-features', CustomPlanFeatureController::class);
        Route::resource('pricing-tables', PricingTableController::class);
        Route::get('pricing-booking', [PricingBookingController::class, 'edit'])->name('pricing-booking.edit');
        Route::put('pricing-booking', [PricingBookingController::class, 'update'])->name('pricing-booking.update');
        Route::post('pricing-tables/{pricingTable}/contents', [PricingTableController::class, 'storeContent'])
            ->name('pricing-tables.contents.store');
        Route::put('pricing-table-contents/{content}', [PricingTableController::class, 'updateContent'])
            ->name('pricing-table-contents.update');
        Route::delete('pricing-table-contents/{content}', [PricingTableController::class, 'destroyContent'])
            ->name('pricing-table-contents.destroy');
        Route::resource('articles', ArticleController::class);
        Route::delete('article-images/{articleImage}', [ArticleImageController::class, 'destroy'])
            ->name('article-images.destroy');
        Route::get('/mission', [MissionController::class, 'edit'])->name('mission.edit');
        Route::put('/mission', [MissionController::class, 'update'])->name('mission.update');
        Route::get('/president-showcase', [PresidentShowcaseController::class, 'edit'])->name('president-showcase.edit');
        Route::put('/president-showcase', [PresidentShowcaseController::class, 'update'])->name('president-showcase.update');
        Route::get('/dashboard360', [Dashboard360Controller::class, 'edit'])->name('dashboard360.edit');
        Route::put('/dashboard360', [Dashboard360Controller::class, 'update'])->name('dashboard360.update');
        Route::get('/why-choose-us', [WhyChooseUsController::class, 'edit'])->name('why-choose-us.edit');
        Route::put('/why-choose-us', [WhyChooseUsController::class, 'update'])->name('why-choose-us.update');
        Route::resource('why-choose-us-features', WhyChooseUsFeatureController::class);
        Route::get('/beyond-hiring', [BeyondHiringController::class, 'edit'])->name('beyond-hiring.edit');
        Route::put('/beyond-hiring', [BeyondHiringController::class, 'update'])->name('beyond-hiring.update');

        // Drivers (job openings)
        Route::patch('driver-positions/{driverPosition}/status', [DriverPositionController::class, 'status'])->name('driver-positions.status');
        Route::post('driver-positions/{driverPosition}/duplicate', [DriverPositionController::class, 'duplicate'])->name('driver-positions.duplicate');
        Route::resource('driver-positions', DriverPositionController::class)->except('show');

        Route::get('driver-applications/export', [DriverApplicationController::class, 'export'])->name('driver-applications.export');
        Route::post('driver-applications/bulk-status', [DriverApplicationController::class, 'bulkStatus'])->name('driver-applications.bulk-status');
        Route::patch('driver-applications/{driverApplication}/status', [DriverApplicationController::class, 'status'])->name('driver-applications.status');
        Route::patch('driver-applications/{driverApplication}/unread', [DriverApplicationController::class, 'markUnread'])->name('driver-applications.unread');
        Route::post('driver-applications/{driverApplication}/notes', [DriverApplicationController::class, 'storeNote'])->name('driver-applications.notes.store');
        Route::delete('driver-application-notes/{note}', [DriverApplicationController::class, 'destroyNote'])->name('driver-application-notes.destroy');
        Route::resource('driver-applications', DriverApplicationController::class)->only(['index', 'show', 'destroy']);

        Route::get('/drivers-page', [DriversPageController::class, 'edit'])->name('drivers-page.edit');
        Route::put('/drivers-page', [DriversPageController::class, 'update'])->name('drivers-page.update');
        Route::get('/hiring-settings', [HiringSettingController::class, 'edit'])->name('hiring-settings.edit');
        Route::put('/hiring-settings', [HiringSettingController::class, 'update'])->name('hiring-settings.update');
        Route::post('/hiring-settings/test', [HiringSettingController::class, 'test'])->name('hiring-settings.test');

        // Rich text editor image uploads
        Route::post('editor-uploads', [EditorUploadController::class, 'store'])->name('editor-uploads.store');
    });

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
