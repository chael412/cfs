<?php

use App\Http\Controllers\CollectorController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerPlanController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', 'dashboard');



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::resource('customers', CustomerController::class)->names('customers');
    Route::resource('collectors', CollectorController::class)->names('collectors');
    Route::resource('plans', PlanController::class)->names('plans');
    Route::resource('customer_plans', CustomerPlanController::class)->names('customer_plans');

    Route::get('/show_customers_plans/{id}/', [CustomerPlanController::class, 'ShowCustomerPlans'])
    ->name('show_customer_plans');



});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
