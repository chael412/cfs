<?php

namespace App\Http\Controllers;

use App\Http\Resources\CollectorResource;
use App\Http\Resources\TransactionResource;
use App\Models\Collector;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdvanceBillxController extends Controller
{
    //API
    public function print($id)
    {
        $transaction = Transaction::with(['customerPlan.customer', 'customerPlan.collector'])
            ->findOrFail($id);

        // Get the last transaction before this one
        $lastTransaction = Transaction::where('customer_plan_id', $transaction->customer_plan_id)
            ->where('id', '<', $transaction->id)
            ->latest()
            ->first();

        $outstandingBalance = null;
        $billingMonth = null;

        if ($lastTransaction) {
            $outstandingBalance = $lastTransaction->bill_amount - $lastTransaction->partial;
            $billingMonth = $lastTransaction->created_at->format('F Y');
        }

        return Inertia::render('TransactionAdvance/Print', [
            'transaction' => $transaction,
            'outstanding_balance' => $outstandingBalance,
            'billing_month' => $billingMonth,
        ]);
    }


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('TransactionAdvance/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('TransactionAdvance/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Find transaction by ID
        $transaction = Transaction::findOrFail($id);

        // Load relationships
        $transaction->load([
            'customerPlan.customer',
            'customerPlan.plan',
            'customerPlan.collector',
        ]);

        // Fetch collectors
        $collectors = Collector::all();

        // ✅ Get the latest transaction for this customer plan
        $latestTransaction = Transaction::where('customer_plan_id', $transaction->customer_plan_id)
            ->latest('created_at')
            ->first();

        $balance = null;
        $month = null;

        if ($latestTransaction) {
            $balance = $latestTransaction->bill_amount - $latestTransaction->partial;
            $month = Carbon::parse($latestTransaction->created_at)->format('F');
        }

        return inertia('TransactionAdvance/Show', [
            'transaction' => new TransactionResource($transaction),
            'collectors'  => CollectorResource::collection($collectors),
            'latest'      => [
                'balance' => $balance,
                'month'   => $month,
            ],
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        // Find transaction by ID
        $transaction = Transaction::findOrFail($id);

        // Load relationships
        $transaction->load([
            'customerPlan.customer',
            'customerPlan.plan',
            'customerPlan.collector',
        ]);

        // Fetch collectors
        $collectors = Collector::all();

        // ✅ Get the last transaction *before* this one
        $lastTransaction = Transaction::where('customer_plan_id', $transaction->customer_plan_id)
            ->where('id', '<', $transaction->id) // exclude the current one
            ->latest('created_at')
            ->first();

        $balance = null;
        $month   = null;

        if ($lastTransaction) {
            $balance = $lastTransaction->bill_amount - $lastTransaction->partial;
            $month   = $lastTransaction->created_at->format('F');
        }

        return inertia('TransactionAdvance/Edit', [
            'transaction' => new TransactionResource($transaction),
            'collectors'  => CollectorResource::collection($collectors),
            'latest'      => [
                'balance' => $balance,
                'month'   => $month,
            ],
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
