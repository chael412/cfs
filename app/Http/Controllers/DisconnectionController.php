<?php

namespace App\Http\Controllers;

use App\Http\Resources\CustomerPlanResource;
use App\Models\Customer;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use Inertia\Inertia;

class DisconnectionController extends Controller
{
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
                ->where('status', 'inactive')
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
        return Inertia::render('Disconnection/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Disconnection/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerRequest $request)
    {
        try {
            $data = $request->validated();
            Customer::create($data);

            return to_route('disconnections.index');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $customer = Customer::with(['customerPlans', 'collector']) // eager load if needed
            ->findOrFail($id);

        return inertia('Disconnection/Show', [
            'customer' => $customer,
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $customer = Customer::with(['customerPlans', 'collector']) // eager load if needed
            ->findOrFail($id);

        return inertia('Disconnection/Edit', [
            'customer' => $customer,
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerRequest $request, $id)
    {
        try {
            $data = $request->validated();

            $customer = Customer::findOrFail($id);
            $customer->update($data);

            return redirect()->route('disconnections.index')
                ->with('success', 'Customer updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => 'Error updating customer: ' . $e->getMessage()
            ])->withInput();
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $customer = Customer::findOrFail($id);
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
