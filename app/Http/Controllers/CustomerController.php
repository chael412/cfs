<?php

namespace App\Http\Controllers;

use App\Http\Resources\CustomerResource;
use App\Models\Collector;
use App\Models\Customer;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function customerTransactions1(Request $request)
    {
        $search = $request->input('search');
        $searchBy = $request->input('searchBy'); // choices: fullname, lastname, id

        $query = Customer::with(['customerPlans.transactions']);

        if ($search) {
            if ($searchBy) {
                // If searchBy is provided, respect it
                if ($searchBy === 'lastname') {
                    $query->where('lastname', 'like', "%{$search}%");
                } elseif ($searchBy === 'id') {
                    $query->where('id', $search);
                } elseif ($searchBy === 'fullname') {
                    $query->whereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ["%{$search}%"]);
                }
            } else {
                // Automatic search across multiple fields
                $query->where(function ($q) use ($search) {
                    $q->where('lastname', 'like', "%{$search}%")
                        ->orWhere('id', $search)
                        ->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ["%{$search}%"]);
                });
            }
        }

        $customers = $query->paginate(20);

        return response()->json($customers);
    }

    public function customerTransactions()
    {
        try {
            $search = request('search'); // unified search input
            $sortColumn = request('sortColumn', 'lastname');
            $sortDirection = request('sortDirection', 'asc');

            $validSortColumns = ['lastname'];

            if (!in_array($sortColumn, $validSortColumns)) {
                $sortColumn = 'lastname';
            }

            $query = Customer::with(['customerPlans.plan', 'customerPlans.transactions' => function ($q) {
                $q->latest(); // only fetch transactions in descending order
            }])
                ->where('status', 'active')
                ->when($search, function ($query) use ($search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('lastname', 'like', $search . '%')
                            ->orWhere('id', $search)
                            ->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ["%{$search}%"]);
                    });
                });

            $data = $query->orderBy($sortColumn, $sortDirection)
                ->paginate(100);

            // Append balance + month of last transaction
            $data->getCollection()->transform(function ($customer) {
                foreach ($customer->customerPlans as $plan) {
                    $latestTransaction = $plan->transactions->first(); // latest because of ->latest() above

                    if ($latestTransaction) {
                        $plan->latest_balance = $latestTransaction->bill_amount - $latestTransaction->partial;
                        $plan->latest_balance_month = \Carbon\Carbon::parse($latestTransaction->created_at)->format('F'); // e.g. "July"
                    } else {
                        $plan->latest_balance = 0;
                        $plan->latest_balance_month = null;
                    }
                }
                return $customer;
            });

            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 404);
        }
    }




    // api function
    public function showCustomerTransaction($id)
    {
        $customer = Customer::with(['customerPlans.transactions'])
            ->withExists('transactions') // ✅ now this works
            ->findOrFail($id);

        $customer->has_transaction = $customer->transactions_exists;
        unset($customer->transactions_exists);

        return response()->json($customer);
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

            $query = Customer::query()
                ->where('status', 'active')
                ->when($search, function ($query) use ($search) {
                    return $query->where('lastname', 'like', $search . '%');
                });

            $data = $query->orderBy($sortColumn, $sortDirection)
                ->paginate(10);

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
        return Inertia::render('Customer/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $collectors = Collector::orderBy('lastname', 'asc')->get();

        return Inertia::render('Customer/Create', ['collectors' => $collectors]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerRequest $request)
    {
        try {
            $data = $request->validated();
            Customer::create($data);

            return to_route('customers.index');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        return inertia('Customer/Show', [
            'customer' => new CustomerResource($customer),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer)
    {
        return inertia('Customer/Edit', [
            'customer' => new CustomerResource($customer),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        try {
            $data = $request->validated();

            $customer->update($data);

            return redirect()->route('customers.index');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Error updating material: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {

        try {
            $customer->delete();
            return response()->json([
                'message' => 'Customer deleted successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting customer: ' . $e->getMessage()
            ], 500);
        }
    }
}
