<?php

use App\Http\Controllers\CollectorController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerPlanController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('get_customerx_paginate', [CustomerController::class, 'indexApi']);
Route::get('get_collectorx_paginate', [CollectorController::class, 'indexApi']);
Route::get('get_customer_planx_paginate', [CustomerPlanController::class, 'indexApi']);



