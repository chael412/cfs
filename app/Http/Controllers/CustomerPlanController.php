<?php

namespace App\Http\Controllers;

use App\Models\CustomerPlan;
use App\Http\Requests\StoreCustomerPlanRequest;
use App\Http\Requests\UpdateCustomerPlanRequest;
use App\Http\Resources\CustomerPlanResource;
use App\Models\Customer;
use App\Models\Plan;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class CustomerPlanController extends Controller
{
    //Api function
    public function getLatestCustomerPlan($customerId)
{
    // Retrieve the customer with their associated plans, then get the latest plan
    $customer = Customer::with('customerPlans.plan')->findOrFail($customerId);

    // Get the latest plan from the associated plans
    $latestPlan = $customer->customerPlans->sortByDesc(function($plan) {
        return $plan->created_at; // or another timestamp field
    })->first();

    return $latestPlan;
}

public function ShowCustomerPlans($id)
{
    // Retrieve the customer and order the customerPlans by 'id' in descending order
    $customer = Customer::with(['customerPlans' => function ($query) {
        $query->orderBy('id', 'desc');
    }, 'customerPlans.plan'])
        ->findOrFail($id);

    // Get the latest plan for the customer (if needed)
    $latestPlan = $this->getLatestCustomerPlan($id);
    $plans = Plan::orderBy('mbps')->get();

    // Return the data to an Inertia.js view
    return inertia('CustomerPlan/Show', [
        'customer' => $customer,
        'latestPlan' => $latestPlan,
        'plans' => $plans,
    ]);
}



    public function indexApi()
{
    try {
        $search = request('lastname');
        $sortColumn = request('sortColumn', 'lastname');
        $sortDirection = request('sortDirection', 'asc');

        $validSortColumns = [
            'lastname',
        ];

        if (!in_array($sortColumn, $validSortColumns)) {
            $sortColumn = 'lastname';
        }

        // Query CustomerPlan with distinct customer_id and latest plan
        $query = CustomerPlan::with(['customer', 'plan'])
            ->select('customer_plans.*')
            ->joinSub(
                CustomerPlan::select('customer_id', DB::raw('MAX(created_at) as latest_plan'))
                    ->groupBy('customer_id'),
                'latest_plans',
                function ($join) {
                    $join->on('customer_plans.customer_id', '=', 'latest_plans.customer_id')
                        ->on('customer_plans.created_at', '=', 'latest_plans.latest_plan');
                }
            )
            ->when($search, function ($query) use ($search) {
                return $query->whereHas('customer', function ($q) use ($search) {
                    $q->where('lastname', 'like', $search . '%');
                });
            });

        $data = $query->orderBy(
            Customer::select($sortColumn)
                ->whereColumn('customers.id', 'customer_plans.customer_id'),
            $sortDirection
        )->paginate(50);

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
        return Inertia::render('CustomerPlan/Index');

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $customers = Customer::orderBy('lastname')->get();
        $plans = Plan::orderBy('mbps')->get();


        return Inertia::render('CustomerPlan/Create', ['customers' => $customers, 'plans' => $plans]);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerPlanRequest $request)
    {
        try {
            $data = $request->validated();
                CustomerPlan::create($data);

            return to_route('customer_plans.index');

        }  catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(CustomerPlan $customerPlan)
    {
        $customerPlan->load('customer', 'plan');


        return inertia('CustomerPlan/Show', [
            'customerPlan' => new CustomerPlanResource($customerPlan),
        ]);

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CustomerPlan $customerPlan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerPlanRequest $request, CustomerPlan $customerPlan)
    {
        try {
            $data = $request->validated();

            $customerPlan->update($data);

            return redirect()->route('customers.showPlans', ['id' => $customerPlan->customer_id]);
            // return redirect()->route('customer_plans.index');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Error updating customer plan: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CustomerPlan $customerPlan)
    {
        //
    }
}
