<?php

use App\Http\Controllers\RestaurantController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::resource('restaurants', RestaurantController::class)
    ->middleware(['auth', 'verified'])
    ->names('restaurants');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
