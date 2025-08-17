<?php

use App\Http\Controllers\AdvanceBillingController;
use App\Http\Controllers\BatchBillingController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\CollectorController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerPlanController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WalkinBillingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('get_customerx_paginate', [CustomerController::class, 'indexApi']);
Route::get('get_collectorx_paginate', [CollectorController::class, 'indexApi']);
Route::get('get_customer_planx_paginate', [CustomerPlanController::class, 'indexApi']);
Route::get('get_billx_paginate', [BillController::class, 'indexApi']);

Route::get('get_customerwplanx', [BillController::class, 'getCustomersWithPlans']);
Route::get('get_walkinbillx', [WalkinBillingController::class, 'indexApi']);
Route::get('get_advancebillx', [AdvanceBillingController::class, 'indexApi']);
Route::get('get_batchbillx', [BatchBillingController::class, 'indexApi']);


Route::get('/customers/{id}/transactions', [CustomerController::class, 'showCustomerTransaction']);
Route::post('/transactions', [TransactionController::class, 'storeTransaction']);
Route::get('/customers/transactions', [CustomerController::class, 'customerTransactions']);



Route::get('/customers/{customerId}/latest-plan', [BillController::class, 'getLatestPlanForCustomer']);
Route::get('/hello', function () {
    return response()->json(['message' => 'Hello World']);
});
