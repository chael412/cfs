<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CollectionController extends Controller
{
    public function show(Request $request)
    {
        $query = Transaction::with([
            'customerPlan.plan',
            'customerPlan.collector',
            'customerPlan.customer.purok.barangay.municipality',
        ]);

        // ✅ Filter by custom start_date and end_date
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('date_billing', [
                $request->start_date,
                $request->end_date
            ]);
        } elseif ($request->filled('start_date')) {
            $query->whereDate('date_billing', '>=', $request->start_date);
        } elseif ($request->filled('end_date')) {
            $query->whereDate('date_billing', '<=', $request->end_date);
        } else {
            // ✅ default to today if no params
            $today = now()->toDateString();
            $query->whereDate('date_billing', $today);
        }

        // ✅ Filter by collector_id if provided
        if ($request->filled('collector_id')) {
            $query->where('collector_id', $request->collector_id);
        }

        // ✅ Filter by status if provided
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // ✅ Fetch all transactions
        $transactions = $query->get();

        // ✅ Add per-transaction balance
        $transactions->transform(function ($transaction) {
            $transaction->outstanding_balance = ($transaction->bill_amount ?? 0) - ($transaction->partial ?? 0);
            return $transaction;
        });

        // ✅ Compute grand totals
        $grandTotalPartial  = $transactions->sum('partial');
        $grandTotalRebate   = $transactions->sum('rebate');
        $grandTotalBills    = $transactions->sum('bill_amount');
        $grandTotalBalance  = $transactions->sum('outstanding_balance'); // 🔑 balance total

        return Inertia::render('Collection/Show', [
            'transactions' => $transactions,
            'filters' => [
                'start_date'   => $request->start_date ?? now()->toDateString(),
                'end_date'     => $request->end_date ?? now()->toDateString(),
                'collector_id' => $request->collector_id ?? null,
                'status'       => $request->status ?? null,
            ],
            'grand_totals' => [
                'bill_amount' => $grandTotalBills,
                'partial'     => $grandTotalPartial,
                'rebate'      => $grandTotalRebate,
                'balance'     => $grandTotalBalance, // 🔑 include balance
            ],
        ]);
    }


    // public function show(Request $request)
    // {
    //     $query = Transaction::with([
    //         'customerPlan.plan',
    //         'customerPlan.collector',
    //         'customerPlan.customer.purok.barangay.municipality',
    //     ]);

    //     // ✅ Filter by custom start_date and end_date
    //     if ($request->filled('start_date') && $request->filled('end_date')) {
    //         $query->whereBetween('date_billing', [
    //             $request->start_date,
    //             $request->end_date
    //         ]);
    //     } elseif ($request->filled('start_date')) {
    //         $query->whereDate('date_billing', '>=', $request->start_date);
    //     } elseif ($request->filled('end_date')) {
    //         $query->whereDate('date_billing', '<=', $request->end_date);
    //     } else {
    //         // ✅ default to today if no params
    //         $today = now()->toDateString();
    //         $query->whereDate('date_billing', $today);
    //     }

    //     // ✅ Filter by collector_id if provided
    //     if ($request->filled('collector_id')) {
    //         $query->where('collector_id', $request->collector_id);
    //     }

    //     // ✅ Filter by status if provided
    //     if ($request->filled('status')) {
    //         $query->where('status', $request->status);
    //     }

    //     // ✅ Fetch all transactions without pagination
    //     $transactions = $query->get();

    //     // ✅ Compute outstanding balance (bill_amount - partial)
    //     $transactions->transform(function ($transaction) {
    //         $transaction->outstanding_balance = ($transaction->bill_amount ?? 0) - ($transaction->partial ?? 0);
    //         return $transaction;
    //     });

    //     // ✅ Compute grand totals
    //     $grandTotalPartial = $transactions->sum('partial');
    //     $grandTotalRebate = $transactions->sum('rebate');

    //     return Inertia::render('Collection/Show', [
    //         'transactions' => $transactions,
    //         'filters' => [
    //             'start_date'   => $request->start_date ?? now()->toDateString(),
    //             'end_date'     => $request->end_date ?? now()->toDateString(),
    //             'collector_id' => $request->collector_id ?? null,
    //             'status'       => $request->status ?? null,
    //         ],
    //         'grand_totals' => [
    //             'partial' => $grandTotalPartial,
    //             'rebate'  => $grandTotalRebate,
    //         ],
    //     ]);
    // }


    // public function show(Request $request)
    // {
    //     $query = Transaction::with([
    //         'customerPlan.plan',
    //         'customerPlan.collector',
    //         'customerPlan.customer.purok.barangay.municipality',
    //     ]);

    //     // ✅ Filter by custom start_date and end_date
    //     if ($request->filled('start_date') && $request->filled('end_date')) {
    //         $query->whereBetween('date_billing', [
    //             $request->start_date,
    //             $request->end_date
    //         ]);
    //     } elseif ($request->filled('start_date')) {
    //         $query->whereDate('date_billing', '>=', $request->start_date);
    //     } elseif ($request->filled('end_date')) {
    //         $query->whereDate('date_billing', '<=', $request->end_date);
    //     } else {
    //         // ✅ default to today if no params
    //         $today = now()->toDateString();
    //         $query->whereDate('date_billing', $today);
    //     }

    //     // ✅ Filter by collector_id if provided
    //     if ($request->filled('collector_id')) {
    //         $query->where('collector_id', $request->collector_id);
    //     }

    //     // ✅ Fetch all transactions without pagination
    //     $transactions = $query->get();

    //     // ✅ Compute outstanding balance (bill_amount - partial)
    //     $transactions->transform(function ($transaction) {
    //         $transaction->outstanding_balance = ($transaction->bill_amount ?? 0) - ($transaction->partial ?? 0);
    //         return $transaction;
    //     });

    //     // ✅ Compute grand totals
    //     $grandTotalPartial = $transactions->sum('partial');
    //     $grandTotalRebate = $transactions->sum('rebate');

    //     return Inertia::render('Collection/Show', [
    //         'transactions' => $transactions,
    //         'filters' => [
    //             'start_date' => $request->start_date ?? now()->toDateString(),
    //             'end_date' => $request->end_date ?? now()->toDateString(),
    //             'collector_id' => $request->collector_id ?? null,
    //         ],
    //         'grand_totals' => [
    //             'partial' => $grandTotalPartial,
    //             'rebate' => $grandTotalRebate,
    //         ],
    //     ]);
    // }



    public function index()
    {
        return Inertia::render('Collection/Index');
    }

    // public function show(Request $request)
    // {
    //     $query = Transaction::with([
    //         'customerPlan.plan',
    //         'customerPlan.collector',
    //         'customerPlan.customer.purok.barangay.municipality',
    //     ]);

    //     // ✅ Filter by custom start_date and end_date
    //     if ($request->filled('start_date') && $request->filled('end_date')) {
    //         $query->whereBetween('date_billing', [
    //             $request->start_date,
    //             $request->end_date
    //         ]);
    //     } elseif ($request->filled('start_date')) {
    //         $query->whereDate('date_billing', '>=', $request->start_date);
    //     } elseif ($request->filled('end_date')) {
    //         $query->whereDate('date_billing', '<=', $request->end_date);
    //     } else {
    //         // ✅ default to today if no params
    //         $today = now()->toDateString();
    //         $query->whereDate('date_billing', $today);
    //     }

    //     // ✅ Fetch all transactions without pagination
    //     $transactions = $query->get();

    //     // ✅ Compute outstanding balance (bill_amount - partial)
    //     $transactions->transform(function ($transaction) {
    //         $transaction->outstanding_balance = ($transaction->bill_amount ?? 0) - ($transaction->partial ?? 0);
    //         return $transaction;
    //     });


    //     return Inertia::render('Collection/Show', [
    //         'transactions' => $transactions,
    //         'filters' => [
    //             'start_date' => $request->start_date ?? now()->toDateString(),
    //             'end_date' => $request->end_date ?? now()->toDateString(),
    //         ],
    //     ]);
    // }
}
