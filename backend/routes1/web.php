<?php

use App\Http\Controllers\Api\ReviewController;
use Illuminate\Support\Facades\Route;

// Route::get('{any}', function () {
//     return file_get_contents(public_path('frontend/index.html'));
// })->where('any', '.*');

require __DIR__.'/auth.php';

Route::get('feedback', function () {
    return view('review');
});

Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
