<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\WebsiteController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    
    // General data (header + footer)
    Route::get('/general', [WebsiteController::class, 'general']);
    
    // Homepage data
    Route::get('/homepage', [WebsiteController::class, 'homepage']);
    
    // Pricing page data
    Route::get('/pricing', [WebsiteController::class, 'pricing']);
    
    // Newsletter data
    Route::get('/newsletter', [WebsiteController::class, 'newsletter']);
    
    //Why T360?
    Route::get('/why-t360', [WebsiteController::class, 'whyT360']);

    //Dashboard360
    Route::get('/dashboard360', [WebsiteController::class, 'dashboard360']);
});

