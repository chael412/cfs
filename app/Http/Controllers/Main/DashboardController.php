<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Collector;
use App\Models\Customer;
use App\Models\CustomerPlan;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $activeCustomers = Customer::where('status', 'active')->count();
        $inactiveCustomers = Customer::where('status', 'inactive')->count();
        $collectors = Collector::count();

        return Inertia::render('Dashboard', [
            'activeCustomers' => $activeCustomers,
            'inactiveCustomers' => $inactiveCustomers,
            'collectors' => $collectors,
        ]);
    }

    public function getTotalCollection()
    {
        $totalCollection = CustomerPlan::with('plan')
            ->get()
            ->sum(function ($customerPlan) {
                return $customerPlan->plan->plan_price;
            });

        return response()->json([
            'total_collection' => $totalCollection
        ]);
    }

    public function transactionSummary(Request $request)
    {
        $month = $request->input('month'); // e.g. "09"
        $year  = $request->input('year', now()->year); // default current year

        $query = Transaction::query();

        if ($year) {
            $query->whereYear('date_billing', $year);
        }

        if ($month) {
            $query->whereMonth('date_billing', $month);
        }

        // === Overall ===
        $overall = (clone $query)->selectRaw('
        COALESCE(SUM(partial), 0) as total_partial,
        COALESCE(SUM(rebate), 0) as total_rebate,
        COALESCE(SUM(bill_amount), 0) as total_bill_amount
    ')->first();

        // === Advance ===
        $advance = (clone $query)->where('remarks', 'advance')->selectRaw('
        COALESCE(SUM(partial), 0) as total_partial,
        COALESCE(SUM(rebate), 0) as total_rebate,
        COALESCE(SUM(bill_amount), 0) as total_bill_amount
    ')->first();

        // === Batch ===
        $batch = (clone $query)->where('remarks', 'batch')->selectRaw('
        COALESCE(SUM(partial), 0) as total_partial,
        COALESCE(SUM(rebate), 0) as total_rebate,
        COALESCE(SUM(bill_amount), 0) as total_bill_amount
    ')->first();

        return response()->json([
            'month'   => $month,
            'year'    => $year,
            'overall' => [
                'total_partial' => $overall->total_partial,
                'total_rebate'  => $overall->total_rebate,
                'total_bill'    => $overall->total_bill_amount,
                'net_pay'       => $overall->total_partial - $overall->total_rebate,
            ],
            'advance' => [
                'total_partial' => $advance->total_partial,
                'total_rebate'  => $advance->total_rebate,
                'total_bill'    => $advance->total_bill_amount,
                'net_pay'       => $advance->total_partial - $advance->total_rebate,
            ],
            'batch'   => [
                'total_partial' => $batch->total_partial,
                'total_rebate'  => $batch->total_rebate,
                'total_bill'    => $batch->total_bill_amount,
                'net_pay'       => $batch->total_partial - $batch->total_rebate,
            ]
        ]);
    }
}
