<?php

namespace App\Http\Controllers;

use App\Models\BatchBilling;
use App\Http\Requests\StoreBatchBillingRequest;
use App\Http\Requests\UpdateBatchBillingRequest;
use App\Models\Customer;
use Inertia\Inertia;
use Illuminate\Support\Str;

class BatchBillingController extends Controller
{
    public function indexApi()
    {
        try {
            $search = request('lastname');
            $sortColumn = request('sortColumn', 'lastname');
            $sortDirection = request('sortDirection', 'asc');

            $validSortColumns = ['lastname'];

            if (!in_array($sortColumn, $validSortColumns)) {
                $sortColumn = 'lastname';
            }

            $query = BatchBilling::with([
                'customerPlan.customer',
                'customerPlan.plan',
                'customerPlan.collector',
            ])
                ->join('customer_plans', 'batch_billings.customer_plan_id', '=', 'customer_plans.id')
                ->join('customers', 'customer_plans.customer_id', '=', 'customers.id')
                ->when($search, function ($query) use ($search) {
                    $query->where('customers.lastname', 'like', $search . '%');
                });

            // Apply sorting on the joined customers table
            if ($sortColumn === 'lastname') {
                $query = $query->orderBy('customers.lastname', $sortDirection);
            }

            // Important: select batch_billings.* to avoid column ambiguity
            $data = $query->select('batch_billings.*')->paginate(50);

            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 404);
        }
    }


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('BatchBill/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $yearPrefix = now()->format('y'); // '25' for 2025

        // Get latest bill_no starting with current year prefix
        $latestBill = BatchBilling::where('bill_no', 'like', $yearPrefix . '%')
            ->orderBy('bill_no', 'desc')
            ->first();

        if ($latestBill) {
            // Get the numeric suffix and increment it
            $lastNumber = (int) Str::substr($latestBill->bill_no, 2); // remove '25'
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        // Pad to always have 3 digits
        $newBillNo = $yearPrefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT); // e.g. 25001

        $customers = Customer::orderBy('lastname', 'asc')->get();

        return Inertia::render('BatchBill/Create', [
            'customers' => $customers,
            'generated_bill_no' => $newBillNo,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBatchBillingRequest $request)
    {
        try {
            $data = $request->validated();
            BatchBilling::create($data);

            return to_route('batch_bills.index');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $batchBilling = BatchBilling::with([
            'customerPlan.customer',
            'customerPlan.plan',
            'customerPlan.collector'
        ])->findOrFail($id);

        return inertia('BatchBill/Show', [
            'bill' => [
                'id' => $batchBilling->id,
                'customer_plan_id' => $batchBilling->customer_plan_id,
                'bill_no' => $batchBilling->bill_no,
                'bill_amount' => $batchBilling->bill_amount,
                'customer' => $batchBilling->customerPlan->customer ?? null,
                'plan' => $batchBilling->customerPlan->plan ?? null,
                'collector' => $batchBilling->customerPlan->collector ?? null,
                'created_at' => $batchBilling->created_at,
                'updated_at' => $batchBilling->updated_at,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $batchBilling = BatchBilling::with([
            'customerPlan.customer',
            'customerPlan.plan',
            'customerPlan.collector'
        ])->findOrFail($id);

        return inertia('BatchBill/Edit', [
            'bill' => [
                'id' => $batchBilling->id,
                'customer_plan_id' => $batchBilling->customer_plan_id,
                'bill_no' => $batchBilling->bill_no,
                'bill_amount' => $batchBilling->bill_amount,
                'customer' => $batchBilling->customerPlan->customer ?? null,
                'plan' => $batchBilling->customerPlan->plan ?? null,
                'collector' => $batchBilling->customerPlan->collector ?? null,
                'created_at' => $batchBilling->created_at,
                'updated_at' => $batchBilling->updated_at,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBatchBillingRequest $request, $id)
    {
        try {
            $data = $request->validated();

            $batchBilling = BatchBilling::findOrFail($id);

            $batchBilling->update($data);

            return redirect()->route('batch_bills.index')->with('success', 'Bill updated successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Error updating bill: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $batchBilling = BatchBilling::findOrFail($id);

            $batchBilling->delete();
            return response()->json([
                'message' => 'Batch bill deleted successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting batch bill: ' . $e->getMessage()
            ], 500);
        }
    }
}
