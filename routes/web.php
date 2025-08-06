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

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');


Route::middleware(['auth'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('header',        [HeaderSettingController::class, 'edit'])->name('header.edit');
        Route::put('header',        [HeaderSettingController::class, 'update'])->name('header.update');
        Route::get ('footer', [FooterSettingController::class, 'edit' ])->name('footer.edit');
        Route::put ('footer', [FooterSettingController::class, 'update'])->name('footer.update');
        Route::get ('hero', [HeroSectionController::class, 'edit' ])->name('hero.edit');
        Route::put ('hero', [HeroSectionController::class, 'update'])->name('hero.update');
        Route::get ('video', [VideoSectionController::class, 'edit' ])->name('video.edit');
        Route::put ('video', [VideoSectionController::class, 'update'])->name('video.update');
        Route::resource('sliders', SliderController::class);
        Route::resource('faqs', FaqController::class);
        Route::get ('meeting', [MeetingSectionController::class, 'edit' ])->name('meeting.edit');
        Route::put ('meeting', [MeetingSectionController::class, 'update'])->name('meeting.update');
        Route::get ('form-section', [FormSectionController::class, 'edit' ])->name('form-section.edit');
        Route::put ('form-section', [FormSectionController::class, 'update'])->name('form-section.update');
        Route::resource('pricing-plans', PricingPlanController::class);
        Route::resource('custom-features', CustomPlanFeatureController::class);
        Route::resource('pricing-tables', PricingTableController::class);
        Route::get ('pricing-booking', [PricingBookingController::class,'edit' ])->name('pricing-booking.edit');
        Route::put ('pricing-booking', [PricingBookingController::class,'update'])->name('pricing-booking.update');
        Route::post('pricing-tables/{pricingTable}/contents', [PricingTableController::class, 'storeContent'])
              ->name('pricing-tables.contents.store');
        Route::put('pricing-table-contents/{content}', [PricingTableController::class, 'updateContent'])
              ->name('pricing-table-contents.update');
        Route::delete('pricing-table-contents/{content}', [PricingTableController::class, 'destroyContent'])
              ->name('pricing-table-contents.destroy');
        Route::resource('articles', ArticleController::class);
        Route::delete('article-images/{articleImage}', [ArticleImageController::class,'destroy'])
              ->name('article-images.destroy');
    });

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
