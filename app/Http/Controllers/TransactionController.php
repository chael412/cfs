<?php

namespace App\Http\Controllers;

use App\Http\Resources\CustomerResource;
use App\Http\Resources\TransactionResource;
use App\Models\Customer;
use App\Models\Transaction;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Http\Resources\CollectorResource;
use App\Models\Collector;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TransactionController extends Controller
{

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

        return Inertia::render('Transaction/Print', [
            'transaction' => $transaction,
            'outstanding_balance' => $outstandingBalance,
            'billing_month' => $billingMonth,
        ]);
    }




    // API METHODS
    public function generateBillNo()
    {
        $yearPrefix = now()->format('y'); // e.g. '25' for 2025
        $month = now()->format('n'); // month without leading zero (1–12)

        $prefix = $yearPrefix . $month . '-'; // e.g. '251-'

        // Get latest bill_no starting with this prefix (year + month)
        $latestBill = Transaction::where('bill_no', 'like', $prefix . '%')
            ->orderBy('bill_no', 'desc')
            ->first();

        if ($latestBill) {
            // Extract the last 4 digits
            $lastNumber = (int) Str::after($latestBill->bill_no, '-');
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        // Pad the incrementing number to 4 digits
        $newBillNo = $prefix . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

        return response()->json([
            'bill_no' => $newBillNo,
        ]);
    }


    public function indexApi()
    {
        try {
            $search = request('search');
            $sortColumn = request('sortColumn', 'bill_no');
            $sortDirection = request('sortDirection', 'desc');

            $validSortColumns = ['created_at', 'bill_no', 'bill_amount'];

            if (!in_array($sortColumn, $validSortColumns)) {
                $sortColumn = 'bill_no';
            }

            $query = Transaction::with([
                'customerPlan.customer',
                'customerPlan.plan',
            ])
                ->when($search, function ($query) use ($search) {
                    $query->whereHas('customerPlan.customer', function ($q) use ($search) {
                        $q->where('lastname', 'like', $search . '%')
                            ->orWhere('id', $search)
                            ->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ["%{$search}%"]);
                    })
                        ->orWhere('bill_no', 'like', "%{$search}%");
                });

            // Force bill_no to be sorted by numeric part after the dash
            if ($sortColumn === 'bill_no') {
                $query->orderByRaw("CAST(SUBSTRING_INDEX(bill_no, '-', -1) AS UNSIGNED) {$sortDirection}");
            } else {
                $query->orderBy($sortColumn, $sortDirection);
            }

            $data = $query->paginate(100);

            // Append balance + month of transaction
            $data->getCollection()->transform(function ($transaction) {
                $transaction->balance = $transaction->bill_amount - $transaction->partial;
                $transaction->balance_month = \Carbon\Carbon::parse($transaction->created_at)->format('F');
                return $transaction;
            });

            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }




    public function storeTransaction(StoreTransactionRequest $request)
    {
        try {
            $data = $request->validated();

            // 🔹 Get the plan details
            $customerPlan = \App\Models\CustomerPlan::with('plan')->findOrFail($data['customer_plan_id']);
            $data['plan_price'] = $customerPlan->plan->plan_price ?? null;
            $data['plan_mbps']  = $customerPlan->plan->mbps ?? null;

            // Create transaction
            $transaction = Transaction::create($data);

            $transaction->load(['customerPlan.customer', 'customerPlan.collector']);

            // Get the latest transaction for balance computation
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

            return response()->json([
                'message' => 'Transaction created successfully.',
                'transaction' => $transaction,
                'collector' => $transaction->customerPlan->collector ?? null,
                'customer' => $transaction->customerPlan->customer ?? null,
                'outstanding_balance' => $outstandingBalance,
                'billing_month' => $billingMonth,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create transaction.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }




    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Transaction/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $yearPrefix = now()->format('y'); // e.g. '25' for 2025
        $month = now()->format('n'); // month without leading zero (1–12)

        $prefix = $yearPrefix . $month . '-'; // e.g. '251-'

        // Get latest bill_no starting with this prefix (year + month)
        $latestBill = Transaction::where('bill_no', 'like', $prefix . '%')
            ->orderBy('bill_no', 'desc')
            ->first();

        if ($latestBill) {
            // Extract the last 4 digits
            $lastNumber = (int) Str::after($latestBill->bill_no, '-');
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        // Pad the incrementing number to 4 digits
        $newBillNo = $prefix . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

        $customers = Customer::with('customerPlans.plan') // eager load customerPlans and their related plan
            ->orderBy('lastname', 'asc')
            ->get();


        return Inertia::render('Transaction/Create', [
            'customers' => $customers,
            'generated_bill_no' => $newBillNo,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransactionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        // Load all needed relationships in one go
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

        return inertia('Transaction/Show', [
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
    public function edit(Transaction $transaction)
    {
        // Load all needed relationships in one go
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

        return inertia('Transaction/Edit', [
            'transaction' => new TransactionResource($transaction),
            'collectors'  => CollectorResource::collection($collectors),
            'latest'      => [
                'balance' => $balance,
                'month'   => $month,
            ],
        ]);
    }


    // public function edit(Transaction $transaction)
    // {
    //     // Load all needed relationships in one go
    //     $transaction->load([
    //         'customerPlan.customer',
    //         'customerPlan.plan',
    //         'customerPlan.collector',
    //     ]);

    //     // Fetch collectors
    //     $collectors = Collector::all();

    //     // ✅ Get the latest transaction for this customer plan
    //     $latestTransaction = Transaction::where('customer_plan_id', $transaction->customer_plan_id)
    //         ->latest('created_at')
    //         ->first();

    //     $balance = null;
    //     $month = null;

    //     if ($latestTransaction) {
    //         $balance = $latestTransaction->bill_amount - $latestTransaction->partial;
    //         $month = Carbon::parse($latestTransaction->created_at)->format('F');
    //     }

    //     return inertia('Transaction/Edit', [
    //         'transaction' => new TransactionResource($transaction),
    //         'collectors'  => CollectorResource::collection($collectors),
    //         'latest'      => [
    //             'balance' => $balance,
    //             'month'   => $month,
    //         ],
    //     ]);
    // }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {
        try {
            $data = $request->validated();
            $transaction->update($data);

            return to_route('transactions.edit', $transaction->id);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $transaction = Transaction::findOrFail($id);

            $transaction->delete();
            return response()->json([
                'message' => 'Bill Transaction deleted successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting bill transaction: ' . $e->getMessage()
            ], 500);
        }
    }
}
