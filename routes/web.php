<?php

use App\Http\Controllers\AdvanceBillingController;
use App\Http\Controllers\BannedController;
use App\Http\Controllers\BatchBillingController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\CollectorController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerPlanController;
use App\Http\Controllers\DisconnectionController;
use App\Http\Controllers\Main\DashboardController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PurokController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WalkinBillingController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', 'dashboard');



Route::middleware(['auth', 'verified'])->group(function () {
    // Route::get('/dashboard', function () {
    //     return Inertia::render('Dashboard');
    // })->name('dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/bill_card', function () {
        return Inertia::render('BillCard');
    })->name('bill_card');

    Route::resource('customers', CustomerController::class)->names('customers');
    Route::resource('collectors', CollectorController::class)->names('collectors');
    Route::resource('plans', PlanController::class)->names('plans');
    Route::resource('customer_plans', CustomerPlanController::class)->names('customer_plans');
    Route::resource('bills', BillController::class)->names('bills');
    Route::resource('walkin_bills', WalkinBillingController::class)->names('walkin_bills');
    Route::resource('advance_bills', AdvanceBillingController::class)->names('advance_bills');
    Route::resource('batch_bills', BatchBillingController::class)->names('batch_bills');
    Route::resource('transactions', TransactionController::class)->names('transactions');
    Route::resource('address', PurokController::class)->names('address');



    Route::resource('disconnections', DisconnectionController::class)->names('disconnections');
    Route::resource('banned', BannedController::class)->names('banned');






    Route::get('/show_customers_plans/{id}/', [CustomerPlanController::class, 'ShowCustomerPlans'])
        ->name('show_customer_plans');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
